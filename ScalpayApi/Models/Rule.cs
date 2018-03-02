using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ScalpayApi.Models
{
    public class Rule
    {
        public int Id { get; set; }

        public string ItemKey { get; set; }

        public ConfigItem ConfigItem { get; set; }

        // todo: https://github.com/aspnet/EntityFrameworkCore/issues/242
        public SExpression Condition // null means default rule
        {
            get { return ConditionString != null ? JsonConvert.DeserializeObject<SExpression>(ConditionString) : null; }

            set { ConditionString = value != null ? JsonConvert.SerializeObject(value) : null; }
        }

        public string ConditionString { get; set; }

        public SExpression Result
        {
            get { return ResultString != null ? JsonConvert.DeserializeObject<SExpression>(ResultString) : null; }

            set { ResultString = value != null ? JsonConvert.SerializeObject(value): null; }
        }

        public string ResultString { get; set; }

        public int Order { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}