namespace ScalpayApi.Enums
{
    public enum Privilege
    {
        ProjectViewAll = 1 << 0,
        ProjectView = 1 << 1,
        ProjectAdd = 1 << 2,
        ProjectEdit = 1 << 3,
        ProjectDelete = 1 << 4,
        ItemViewAll = 1 << 5,
        ItemView = 1 << 6,
        ItemAdd = 1 << 7,
        ItemEdit = 1 << 8,
        ItemDelete = 1 << 9,
        UserViewAll = 1 << 10,
        UserView = 1 << 11,
        UserAdd = 1 << 12,
        UserEdit = 1 << 13,
        UserDelete = 1 << 14
    }
}