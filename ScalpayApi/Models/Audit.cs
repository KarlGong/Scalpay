using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class Audit
    {
        public int Id { get; set; }

        public AuditType AuditType { get; set; }

        public string ProjectKey { get; set; }

        public string ItemKey { get; set; }

        public string Operator { get; set; }

        public object Args { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}