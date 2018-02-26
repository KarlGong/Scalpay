using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using ScalpayApi.Services.SExpression;

namespace ScalpayApi.Services
{
    public interface IExpressionService
    {
        Task<SData> EvalExpressionAsync(JToken exp, Dictionary<string, SData> variables);

        Task<SData> ConvertToSDataAsync(JToken value, string dataType);
    }

    public class ExpressionService : IExpressionService
    {
        public async Task<SData> EvalExpressionAsync(JToken exp, Dictionary<string, SData> variables)
        {
            var type = exp["type"].Value<string>();
            var returnType = exp["return"].Value<string>();
            SData result;

            switch (type)
            {
                case "Value":
                    result = await ConvertToSDataAsync(exp["value"], returnType);
                    break;
                case "Var":
                    if (!variables.TryGetValue(exp["var"].Value<string>(), out var variable))
                    {
                        throw new Exception("Variable " + exp["var"].Value<string>() + " is not existing.");
                    }

                    result = variable;
                    break;
                case "Func":
                    var method = typeof(SFunctions).GetMethod(exp["name"].Value<string>());
                    if (method == null)
                    {
                        throw new Exception(exp["name"].Value<string>() + " is not a valid function name.");
                    }

                    var args = exp["args"].Select(a => EvalExpressionAsync(a, variables).Result).ToArray<object>();

                    result = (SData) method.Invoke(null, args);
                    break;
                default: throw new Exception(type + " is not a valid expression type.");
            }

            return await Task.FromResult(result);
        }

        public async Task<SData> ConvertToSDataAsync(JToken value, string dataType)
        {
            SData result;
            switch (dataType)
            {
                case "Bool":
                    result = new SBool(value.Value<bool>());
                    break;
                case "DateTime":
                    result = new SDateTime(value.Value<string>());
                    break;
                case "Duration":
                    result = new SDuration(value.Value<string>());
                    break;
                case "Number":
                    result = new SNumber(value.Value<double>());
                    break;
                case "NumberDict":
                    result = new SNumberDict(value.ToDictionary(i => ((JProperty) i).Name,
                        i => ((JProperty) i).Value.Value<double>()));
                    break;
                case "NumberList":
                    result = new SNumberList(value.Select(i => i.Value<double>()).ToList());
                    break;
                case "String":
                    result = new SString(value.Value<string>());
                    break;
                case "StringDict":
                    result = new SStringDict(value.ToDictionary(i => ((JProperty) i).Name,
                        i => ((JProperty) i).Value.Value<string>()));
                    break;
                case "StringList":
                    result = new SStringList(value.Select(i => i.Value<string>()).ToList());
                    break;
                default: throw new Exception(dataType + " is not a valid data type.");
            }

            return await Task.FromResult(result);
        }
    }
}