using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;
using ScalpayApi.Services.SExpression;

namespace ScalpayApi.Services
{
    public interface IExpressionService
    {
        SData EvalExpression(JToken exp, Dictionary<string, SData> variables);

        SData ConvertToSData(JToken value, string dataType);
    }

    public class ExpressionService : IExpressionService
    {
        public SData EvalExpression(JToken exp, Dictionary<string, SData> variables)
        {
            var type = exp["type"].Value<string>();
            var returnType = exp["return"].Value<string>();

            switch (type)
            {
                case "Value":
                    return ConvertToSData(exp["value"], returnType);
                case "Var":
                    if (!variables.TryGetValue(exp["var"].Value<string>(), out var variable))
                    {
                        throw new Exception("Variable " + exp["var"].Value<string>() + " is not existing.");
                    }

                    return variable;
                case "Func":
                    var method = typeof(SFunctions).GetMethod(exp["name"].Value<string>());
                    if (method == null)
                    {
                        throw new Exception(exp["name"].Value<string>() + " is not a valid function name.");
                    }

                    return (SData) method.Invoke(null, exp["args"].Select(a => EvalExpression(a, variables)).ToArray());
                default: throw new Exception(type + " is not a valid expression type.");
            }
        }

        public SData ConvertToSData(JToken value, string dataType)
        {
            switch (dataType)
            {
                case "Bool":
                    return new SBool(value.Value<bool>());
                case "DateTime":
                    return new SDateTime(value.Value<string>());
                case "Duration":
                    return new SDuration(value.Value<string>());
                case "Number":
                    return new SNumber(value.Value<double>());
                case "NumberDict":
                    return new SNumberDict(value.ToDictionary(i => ((JProperty) i).Name,
                        i => ((JProperty) i).Value.Value<double>()));
                case "NumberList":
                    return new SNumberList(value.Select(i => i.Value<double>()).ToList());
                case "String":
                    return new SString(value.Value<string>());
                case "StringDict":
                    return new SStringDict(value.ToDictionary(i => ((JProperty) i).Name,
                        i => ((JProperty) i).Value.Value<string>()));
                case "StringList":
                    return new SStringList(value.Select(i => i.Value<string>()).ToList());
                default: throw new Exception(dataType + " is not a valid data type.");
            }
        }
    }
}