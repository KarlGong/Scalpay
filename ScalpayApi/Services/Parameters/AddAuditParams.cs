using System;
using Scalpay.Enums;
using Scalpay.Models;

namespace Scalpay.Services.Parameters
{
    public class AddAuditParams
    {
        public AuditType AuditType { get; set; }
        
        public string ProjectKey { get; set; }
        
        public string ItemKey { get; set; }
        
        public object Args { get; set; }
    }
}