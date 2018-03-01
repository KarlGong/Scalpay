using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services.SExpressions;

namespace ScalpayApi.Services
{
    public interface IExpressionService
    {
        Task<SData> EvalExpressionAsync(SExpression exp, Dictionary<string, SData> variables);
        
        Task<SData> ConvertToSDataAsync(JToken value, SDataType dataType);
    }

    public class ExpressionService : IExpressionService
    {
        public async Task<SData> EvalExpressionAsync(SExpression exp, Dictionary<string, SData> variables)
        {
            SData result = null;
            
            switch (exp.ExpType)
            {
                case SExpressionType.Value:
                    result = await ConvertToSDataAsync(exp.Value, exp.ReturnType);
                    break;
                case SExpressionType.Var:
                    if (!variables.TryGetValue(exp.Var, out var variable))
                    {
                        throw new Exception($"Variable {exp.Var} is not existing.");
                    }

                    result = variable;
                    break;
                case SExpressionType.Func:
                    var method = typeof(SFunctions).GetMethod(exp.FuncName);
                    if (method == null)
                    {
                        throw new Exception($"{exp.FuncName} is not a valid function name.");
                    }

                    var args = exp.FuncArgs.Select(a => EvalExpressionAsync(a, variables).Result).ToArray<object>();

                    result = (SData) method.Invoke(null, args);
                    break;
            }

            return await Task.FromResult(result);
        }

        public async Task<SData> ConvertToSDataAsync(JToken value, SDataType dataType)
        {
            SData result = null;
            
            switch (dataType)
            {
                case SDataType.Bool:
                    result = new SBool(value.Value<bool>());
                    break;
                case SDataType.DateTime:
                    result = new SDateTime(value.Value<string>());
                    break;
                case SDataType.Duration:
                    result = new SDuration(value.Value<string>());
                    break;
                case SDataType.Number:
                    result = new SNumber(value.Value<double>());
                    break;
                case SDataType.NumberList:
                    result = new SNumberList(value.Select(i => i.Value<double>()).ToList());
                    break;
                case SDataType.String:
                    result = new SString(value.Value<string>());
                    break;
                case SDataType.StringDict:
                    result = new SStringDict(value.ToDictionary(i => ((JProperty) i).Name,
                        i => ((JProperty) i).Value.Value<string>()));
                    break;
                case SDataType.StringList:
                    result = new SStringList(value.Select(i => i.Value<string>()).ToList());
                    break;
            }

            return await Task.FromResult(result);
        }
    }
}