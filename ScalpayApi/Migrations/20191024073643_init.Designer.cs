﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Scalpay.Data;

namespace Scalpay.Migrations
{
    [DbContext(typeof(ScalpayDbContext))]
    [Migration("20191024073643_init")]
    partial class init
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity("Scalpay.Models.Audit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Args")
                        .IsRequired();

                    b.Property<int>("AuditType");

                    b.Property<DateTime>("InsertTime")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ItemKey");

                    b.Property<string>("Operator");

                    b.Property<string>("ProjectKey");

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.HasKey("Id");

                    b.ToTable("Audits");
                });

            modelBuilder.Entity("Scalpay.Models.Item", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("DefaultResult")
                        .IsRequired();

                    b.Property<string>("Description");

                    b.Property<DateTime>("InsertTime")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsLatest");

                    b.Property<string>("ItemKey")
                        .IsRequired();

                    b.Property<int>("Mode");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("ParameterInfos")
                        .IsRequired();

                    b.Property<string>("ProjectKey")
                        .IsRequired();

                    b.Property<int>("ResultDataType");

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.Property<int>("Version");

                    b.HasKey("Id");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("Scalpay.Models.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<DateTime>("InsertTime")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsLatest");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("ProjectKey")
                        .IsRequired();

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.Property<int>("Version");

                    b.HasKey("Id");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("Scalpay.Models.Rule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Condition")
                        .IsRequired();

                    b.Property<DateTime>("InsertTime")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ItemId");

                    b.Property<int>("Order");

                    b.Property<string>("Result")
                        .IsRequired();

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.HasKey("Id");

                    b.HasIndex("ItemId");

                    b.ToTable("Rule");
                });

            modelBuilder.Entity("Scalpay.Models.User", b =>
                {
                    b.Property<string>("Username")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApiKey")
                        .IsRequired();

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<string>("FullName")
                        .IsRequired();

                    b.Property<DateTime>("InsertTime")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Password")
                        .IsRequired();

                    b.Property<int>("Privileges");

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.HasKey("Username");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Scalpay.Models.Rule", b =>
                {
                    b.HasOne("Scalpay.Models.Item", "Item")
                        .WithMany("Rules")
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}