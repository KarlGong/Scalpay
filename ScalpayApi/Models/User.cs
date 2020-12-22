using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models
{
    public class User
    {
        [Key]
        [Column(TypeName = "varchar(50)")]
        public string Username { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Email { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        [IgnoreDataMember]
        public string Password { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string FullName { get; set; }

        [Required]
        [Column(TypeName = "varchar(10)")]
        public Role Role { get; set; }

        [Required]
        public DateTime InsertTime { get; set; }

        [Required]
        public DateTime UpdateTime { get; set; }
        
        // foreign keys
        public List<ProjectPermission> ProjectPermissions { get; set; }
    }
}