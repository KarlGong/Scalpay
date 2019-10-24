namespace Scalpay.Enums
{
    public enum Privilege
    {
        ProjectManage = 1 << 0,
        ItemManage = 1 << 1,
        UserManage = 1 << 2
    }
}