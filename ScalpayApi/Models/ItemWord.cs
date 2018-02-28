using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class ItemWord : Item
    {
        public override ItemType Type
        {
            get { return ItemType.Word; }
        }
    }
}