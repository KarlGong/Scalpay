using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Scalpay.Enums;
using Scalpay.Models.SExpressions;

namespace Scalpay.Models
{
    public class Item
    {
        [Key]
        [Column(TypeName = "varchar(200)")]
        public string Id { get; set; }

        [Column(TypeName = "varchar(1000)")]
        public string Description { get; set; }

        [Required]
        [Column(TypeName = "varchar(1000)")]
        public List<ParameterInfo> ParameterInfos { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public SDataType ResultDataType { get; set; }

        [Required]
        [Column(TypeName = "varchar(1000)")]
        public SExpression DefaultResult { get; set; }
        
        [Required]
        [Column(TypeName = "varchar(10000)")]
        public List<Rule> Rules { get; set; }
        
        [Required]
        public DateTime InsertTime { get; set; }

        [Required]
        public DateTime UpdateTime { get; set; }
        
        // foreign keys
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string ProjectId { get; set; }
        
        public Project Project { get; set; }
    }
    
    public class ParameterInfo
    {
        public string Name { get; set; }
        
        public SDataType DataType { get; set; }
    }
    
    public class Rule
    {
        public SExpression Condition { get; set; }

        public SExpression Result { get; set; }
    }
}