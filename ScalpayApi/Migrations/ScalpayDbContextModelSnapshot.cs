﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using ScalpayApi.Data;
using ScalpayApi.Enums;
using System;

namespace ScalpayApi.Migrations
{
    [DbContext(typeof(ScalpayDbContext))]
    partial class ScalpayDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
                .HasAnnotation("ProductVersion", "2.0.1-rtm-125");

            modelBuilder.Entity("ScalpayApi.Models.Item", b =>
                {
                    b.Property<string>("ItemKey")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Discriminator")
                        .IsRequired();

                    b.Property<DateTime>("InsertTime")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("ProjectKey");

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.HasKey("ItemKey");

                    b.HasIndex("ProjectKey");

                    b.ToTable("Items");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Item");
                });

            modelBuilder.Entity("ScalpayApi.Models.Project", b =>
                {
                    b.Property<string>("ProjectKey")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<DateTime>("InsertTime")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.HasKey("ProjectKey");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("ScalpayApi.Models.Rule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConditionString")
                        .IsRequired()
                        .HasColumnName("Condition");

                    b.Property<DateTime>("InsertTime")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ItemKey");

                    b.Property<int>("Order");

                    b.Property<string>("ResultString")
                        .IsRequired()
                        .HasColumnName("Result");

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.HasKey("Id");

                    b.HasIndex("ItemKey");

                    b.ToTable("Rule");
                });

            modelBuilder.Entity("ScalpayApi.Models.User", b =>
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

                    b.Property<int>("PrivilegesInt")
                        .HasColumnName("Privileges");

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.HasKey("Username");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ScalpayApi.Models.WordInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("InsertTime")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ItemKey");

                    b.Property<string>("Language");

                    b.Property<DateTime>("UpdateTime")
                        .ValueGeneratedOnAddOrUpdate();

                    b.Property<string>("Word");

                    b.HasKey("Id");

                    b.HasIndex("ItemKey");

                    b.ToTable("WordInfo");
                });

            modelBuilder.Entity("ScalpayApi.Models.ConfigItem", b =>
                {
                    b.HasBaseType("ScalpayApi.Models.Item");

                    b.Property<string>("DefaultResultString")
                        .IsRequired()
                        .HasColumnName("DefaultResult");

                    b.Property<int>("Mode");

                    b.Property<string>("ParameterInfosString")
                        .IsRequired()
                        .HasColumnName("ParameterInfos");

                    b.Property<int>("ResultDataType");

                    b.ToTable("ConfigItem");

                    b.HasDiscriminator().HasValue("ConfigItem");
                });

            modelBuilder.Entity("ScalpayApi.Models.WordItem", b =>
                {
                    b.HasBaseType("ScalpayApi.Models.Item");


                    b.ToTable("WordItem");

                    b.HasDiscriminator().HasValue("WordItem");
                });

            modelBuilder.Entity("ScalpayApi.Models.Item", b =>
                {
                    b.HasOne("ScalpayApi.Models.Project", "Project")
                        .WithMany("Items")
                        .HasForeignKey("ProjectKey")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ScalpayApi.Models.Rule", b =>
                {
                    b.HasOne("ScalpayApi.Models.ConfigItem", "ConfigItem")
                        .WithMany("Rules")
                        .HasForeignKey("ItemKey")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ScalpayApi.Models.WordInfo", b =>
                {
                    b.HasOne("ScalpayApi.Models.WordItem", "WordItem")
                        .WithMany("WordInfos")
                        .HasForeignKey("ItemKey")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
