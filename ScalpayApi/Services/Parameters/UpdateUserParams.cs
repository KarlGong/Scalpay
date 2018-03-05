﻿using System.Collections.Generic;
using ScalpayApi.Enums;

namespace ScalpayApi.Services.Parameters
{
    public class UpdateUserParams
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public string FullName { get; set; }

        public List<Privilege> Privileges { get; set; }
    }
}