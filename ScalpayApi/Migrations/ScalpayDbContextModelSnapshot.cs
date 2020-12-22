﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Scalpay.Data;

namespace Scalpay.Migrations
{
    [DbContext(typeof(ScalpayDbContext))]
    partial class ScalpayDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Scalpay.Models.Item", b =>
                {
                    b.Property<string>("ItemKey")
                        .HasColumnType("varchar(200)");

                    b.Property<string>("DefaultResult")
                        .IsRequired()
                        .HasColumnType("varchar(1000)");

                    b.Property<string>("Description")
                        .HasColumnType("varchar(1000)");

                    b.Property<DateTime>("InsertTime")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("ParameterInfos")
                        .IsRequired()
                        .HasColumnType("varchar(1000)");

                    b.Property<string>("ProjectKey")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("ResultDataType")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.Property<string>("Rules")
                        .IsRequired()
                        .HasColumnType("varchar(10000)");

                    b.Property<DateTime>("UpdateTime")
                        .HasColumnType("datetime(6)");

                    b.HasKey("ItemKey");

                    b.HasIndex("ProjectKey");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("Scalpay.Models.Project", b =>
                {
                    b.Property<string>("ProjectKey")
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Description")
                        .HasColumnType("varchar(1000)");

                    b.Property<DateTime>("InsertTime")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("UpdateTime")
                        .HasColumnType("datetime(6)");

                    b.HasKey("ProjectKey");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("Scalpay.Models.ProjectPermission", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("InsertTime")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Permission")
                        .IsRequired()
                        .HasColumnType("varchar(10)");

                    b.Property<string>("ProjectKey")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<DateTime>("UpdateTime")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.HasKey("Id");

                    b.HasIndex("ProjectKey");

                    b.HasIndex("Username");

                    b.ToTable("ProjectPermissions");
                });

            modelBuilder.Entity("Scalpay.Models.User", b =>
                {
                    b.Property<string>("Username")
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<DateTime>("InsertTime")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("varchar(10)");

                    b.Property<DateTime>("UpdateTime")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Username");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Scalpay.Models.Item", b =>
                {
                    b.HasOne("Scalpay.Models.Project", "Project")
                        .WithMany("Items")
                        .HasForeignKey("ProjectKey")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Scalpay.Models.ProjectPermission", b =>
                {
                    b.HasOne("Scalpay.Models.Project", "Project")
                        .WithMany("Permissions")
                        .HasForeignKey("ProjectKey")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Scalpay.Models.User", "User")
                        .WithMany("ProjectPermissions")
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
