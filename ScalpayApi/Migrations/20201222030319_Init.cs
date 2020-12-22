using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Scalpay.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectKey = table.Column<string>(type: "varchar(50)", nullable: false),
                    Description = table.Column<string>(type: "varchar(1000)", nullable: true),
                    InsertTime = table.Column<DateTime>(nullable: false),
                    UpdateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectKey);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Username = table.Column<string>(type: "varchar(50)", nullable: false),
                    Email = table.Column<string>(type: "varchar(50)", nullable: false),
                    Password = table.Column<string>(type: "varchar(50)", nullable: false),
                    FullName = table.Column<string>(type: "varchar(50)", nullable: false),
                    Role = table.Column<string>(type: "varchar(10)", nullable: false),
                    InsertTime = table.Column<DateTime>(nullable: false),
                    UpdateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Username);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    ItemKey = table.Column<string>(type: "varchar(200)", nullable: false),
                    Description = table.Column<string>(type: "varchar(1000)", nullable: true),
                    ParameterInfos = table.Column<string>(type: "varchar(1000)", nullable: false),
                    ResultDataType = table.Column<string>(type: "varchar(20)", nullable: false),
                    DefaultResult = table.Column<string>(type: "varchar(1000)", nullable: false),
                    Rules = table.Column<string>(type: "varchar(10000)", nullable: false),
                    InsertTime = table.Column<DateTime>(nullable: false),
                    UpdateTime = table.Column<DateTime>(nullable: false),
                    ProjectKey = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.ItemKey);
                    table.ForeignKey(
                        name: "FK_Items_Projects_ProjectKey",
                        column: x => x.ProjectKey,
                        principalTable: "Projects",
                        principalColumn: "ProjectKey",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Permission = table.Column<string>(type: "varchar(10)", nullable: false),
                    InsertTime = table.Column<DateTime>(nullable: false),
                    UpdateTime = table.Column<DateTime>(nullable: false),
                    ProjectKey = table.Column<string>(type: "varchar(50)", nullable: false),
                    Username = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectPermissions_Projects_ProjectKey",
                        column: x => x.ProjectKey,
                        principalTable: "Projects",
                        principalColumn: "ProjectKey",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectPermissions_Users_Username",
                        column: x => x.Username,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                });

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
                name: "Users");
        }
    }
}
