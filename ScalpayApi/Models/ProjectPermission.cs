using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Scalpay.Enums;

namespace Scalpay.Models
{
    public class ProjectPermission
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string ProjectKey { get; set; }
        
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Username { get; set; }
        
        [Required]
        [Column(TypeName = "varchar(10)")]
        public Permission Permission { get; set; }

        [Required]
        public DateTime InsertTime { get; set; }

        [Required]
        public DateTime UpdateTime { get; set; }
    }
}    