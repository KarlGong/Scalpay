using System;
using System.Collections.Generic;

namespace ScalpayApi.Models
{
    public class Folder
    {
        public int Id { get; set; }
        
        public string Name { get; set; }
        
        public string Description { get; set; }

        public DateTime InsertTime { get; set; }
        
        public DateTime UpdateTime { get; set; }
        
        public int ProjectId { get; set; }

        public Project Project { get; set; }

        public int? ParentFolderId { get; set; }

        public Folder ParentFolder { get; set; }

        public List<Folder> SubFolders { get; set; } = new List<Folder>();

        public List<Item> SubItems { get; set; } = new List<Item>();
    }
}