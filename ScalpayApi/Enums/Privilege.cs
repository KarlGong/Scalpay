namespace ScalpayApi.Enums
{
    public enum Privilege
    {
        ProjectAdd = 1 << 0,
        ProjectEdit = 1 << 1,
        ProjectDelete = 1 << 2,
        ItemAdd = 1 << 3,
        ItemEdit = 1 << 4,
        ItemDelete = 1 << 5,
        UserManage = 1 << 6
    }
}