using System;
using ScalpayApi.Enums;
using ScalpayApi.Models;

namespace ScalpayApi.Services.Parameters
{
    public class AddAuditParams
    {
        public AuditType AuditType { get; set; }
        
        public string ProjectKey { get; set; }
        
        public string ItemKey { get; set; }
    }
}