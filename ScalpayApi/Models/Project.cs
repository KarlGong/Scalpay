using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scalpay.Models
{
    public class Project
    {
        [Key]
        [Column(TypeName = "varchar(50)")]
        public string Id { get; set; }
        
        [Column(TypeName = "varchar(1000)")]
        public string Description { get; set; }

        [Required]
        public DateTime InsertTime { get; set; }

        [Required]
        public DateTime UpdateTime { get; set; }
        
        // foreign keys
        public List<Item> Items { get; set; }
        
        public List<ProjectPermission> Permissions { get; set; }
    }
}