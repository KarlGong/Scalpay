using System;

namespace Scalpay.Enums
{
    [Flags]
    public enum Permission
    {
        Read = 1,
        Admin = 3
    }
}