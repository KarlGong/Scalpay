using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Scalpay.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ItemKey = table.Column<string>(nullable: false),
                    ProjectKey = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    ParameterInfos = table.Column<string>(nullable: false),
                    ResultDataType = table.Column<string>(nullable: false),
                    DefaultResult = table.Column<string>(nullable: false),
                    InsertTime = table.Column<DateTime>(nullable: false),
                    UpdateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProjectPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProjectKey = table.Column<string>(nullable: false),
                    Username = table.Column<string>(nullable: true),
                    Permission = table.Column<int>(nullable: false),
                    InsertTime = table.Column<DateTime>(nullable: false),
                    UpdateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectPermissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProjectKey = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    InsertTime = table.Column<DateTime>(nullable: false),
                    UpdateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rules",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ItemKey = table.Column<string>(nullable: false),
                    Condition = table.Column<string>(nullable: false),
                    Result = table.Column<string>(nullable: false),
                    Order = table.Column<int>(nullable: false),
                    InsertTime = table.Column<DateTime>(nullable: false),
                    UpdateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rules", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Username = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: false),
                    Password = table.Column<string>(nullable: false),
                    FullName = table.Column<string>(nullable: false),
                    Role = table.Column<string>(nullable: false),
                    InsertTime = table.Column<DateTime>(nullable: false),
                    UpdateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Username);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Items_ItemKey",
                table: "Items",
                column: "ItemKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Items_ProjectKey",
                table: "Items",
                column: "ProjectKey");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectPermissions_ProjectKey",
                table: "ProjectPermissions",
                column: "ProjectKey");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectPermissions_Username",
                table: "ProjectPermissions",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectKey",
                table: "Projects",
                column: "ProjectKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rules_ItemKey",
                table: "Rules",
                column: "ItemKey");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "ProjectPermissions");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Rules");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
