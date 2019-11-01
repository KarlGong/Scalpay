﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Exceptions;
using Scalpay.Models;

namespace Scalpay.Services.ProjectService
{
    public interface IProjectService
    {
        Task<Project> GetProjectAsync(string projectKey);

        Task<ListResults<Project>> GetProjectsAsync(ProjectCriteria criteria);

        Task<Project> AddProjectAsync(Project project);

        Task<Project> UpdateProjectAsync(string projectKey, Project project);

        Task<ProjectPermission> GetProjectPermissionAsync(string projectKey, string username);

        Task<List<ProjectPermission>> GetProjectPermissionsAsync(ProjectPermissionCriteria criteria);

        Task<ProjectPermission> AddProjectPermissionAsync(ProjectPermission projectPermission);

        Task<ProjectPermission> UpdateProjectPermissionAsync(ProjectPermission projectPermission);

        Task DeleteProjectPermissionAsync(string projectKey, string username);
    }

    public class ProjectService : IProjectService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        public ProjectService(ScalpayDbContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<Project> GetProjectAsync(string projectKey)
        {
            var project = await _context.Projects.AsNoTracking().FirstOrDefaultAsync(p => p.ProjectKey == projectKey);
            if (project == null)
            {
                throw new NotFoundException($"The project {projectKey} cannot be found.");
            }

            return project;
        }

        public async Task<ListResults<Project>> GetProjectsAsync(ProjectCriteria criteria)
        {
            return new ListResults<Project>()
            {
                Data = await _context.Projects.AsNoTracking().WithCriteria(criteria).ToListAsync(),
                TotalCount = await _context.Projects.AsNoTracking().CountAsync(criteria)
            };
        }

        public async Task<Project> AddProjectAsync(Project project)
        {
            if (await _context.Projects.AsNoTracking().AnyAsync(p => p.ProjectKey == project.ProjectKey))
            {
                throw new ConflictException($"Project with key {project.ProjectKey} is already existing.");
            }

            project.InsertTime = DateTime.UtcNow;
            project.UpdateTime = DateTime.UtcNow;

            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();

            return project;
        }

        public async Task<Project> UpdateProjectAsync(string projectKey, Project project)
        {
            var oldProject = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectKey == projectKey);
            if (oldProject == null)
            {
                throw new NotFoundException($"The project {projectKey} cannot be found.");
            }

            if (projectKey != project.ProjectKey && await _context.Projects.AsNoTracking().AnyAsync(p => p.ProjectKey == project.ProjectKey))
            {
                throw new ConflictException($"Project with key {project.ProjectKey} is already existing.");
            }
            // currently do not support update project key

            _mapper.Map(project, oldProject);
            oldProject.UpdateTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return oldProject;
        }

        public async Task<ProjectPermission> GetProjectPermissionAsync(string projectKey, string username)
        {
            return await _cache.GetOrCreateAsync($"project-permission-{projectKey}-{username}", async entry =>
            {
                var permission = await _context.ProjectPermissions.FirstOrDefaultAsync(pp => pp.ProjectKey == projectKey && pp.Username == username);
                if (permission == null)
                {
                    return new ProjectPermission()
                    {
                        ProjectKey = projectKey,
                        Username = username,
                        Permission = Permission.None
                    };
                }

                return permission;
            });
        }

        public async Task<List<ProjectPermission>> GetProjectPermissionsAsync(ProjectPermissionCriteria criteria)
        {
            return await _context.ProjectPermissions.AsNoTracking().WithCriteria(criteria).ToListAsync();
        }

        public async Task<ProjectPermission> AddProjectPermissionAsync(ProjectPermission projectPermission)
        {
            _cache.Remove($"project-permission-{projectPermission.ProjectKey}-{projectPermission.Username}");
            var oldPermission = await _context.ProjectPermissions.FirstOrDefaultAsync(pp => pp.ProjectKey == projectPermission.ProjectKey
                                                                                            && pp.Username == projectPermission.Username);
            if (oldPermission == null)
            {
                projectPermission.InsertTime = DateTime.UtcNow;
                projectPermission.UpdateTime = DateTime.UtcNow;
                await _context.ProjectPermissions.AddAsync(projectPermission);
                await _context.SaveChangesAsync();

                return projectPermission;
            }

            oldPermission.Permission = projectPermission.Permission;
            oldPermission.UpdateTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return oldPermission;
        }

        public async Task<ProjectPermission> UpdateProjectPermissionAsync(ProjectPermission projectPermission)
        {
            _cache.Remove($"project-permission-{projectPermission.ProjectKey}-{projectPermission.Username}");
            var oldPermission = await _context.ProjectPermissions.FirstOrDefaultAsync(pp => pp.ProjectKey == projectPermission.ProjectKey
                                                                                            && pp.Username == projectPermission.Username);
            if (oldPermission == null)
            {
                projectPermission.InsertTime = DateTime.UtcNow;
                projectPermission.UpdateTime = DateTime.UtcNow;
                await _context.ProjectPermissions.AddAsync(projectPermission);
                await _context.SaveChangesAsync();

                return projectPermission;
            }

            oldPermission.Permission = projectPermission.Permission;
            oldPermission.UpdateTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return oldPermission;
        }

        public async Task DeleteProjectPermissionAsync(string projectKey, string username)
        {
            _cache.Remove($"project-permission-{projectKey}-{username}");

            var permission = await _context.ProjectPermissions.SingleOrDefaultAsync(pp => pp.ProjectKey == projectKey && pp.Username == username);

            if (permission != null)
            {
                _context.ProjectPermissions.Remove(permission);

                await _context.SaveChangesAsync();
            }
        }
    }
}