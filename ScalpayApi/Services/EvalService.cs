using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Scalpay.Enums;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Models.SExpressions;

namespace Scalpay.Services
{
    public interface IEvalService
    {
        Task<SData> EvalItemAsync(Item item, Dictionary<string, JToken> parameters);
    }

    public class EvalService : IEvalService
    {
        public async Task<SData> EvalItemAsync(Item item, Dictionary<string, JToken> parameters)
        {
            var variables = new Dictionary<string, SData>();

            if (parameters != null)
            {
                foreach (var (key, value) in parameters)
                {
                    var parameterInfo = item.ParameterInfos?.SingleOrDefault(p => p.Name == key);

                    if (parameterInfo == null)
                        continue; // data type not found, since parameter is not declared in parameter list.

                    variables.Add(key, await ConvertToSDataAsync(value, parameterInfo.DataType));
                }
            }

            if (item.Rules != null)
            {
                foreach (var rule in item.Rules)
                {
                    if (((SBool) await EvalExpressionAsync(rule.Condition, variables)).Value)
                    {
                        return await EvalExpressionAsync(rule.Result, variables);
                    }
                }
            }

            return await EvalExpressionAsync(item.DefaultResult, variables);
        }

        private async Task<SData> EvalExpressionAsync(SExpression exp, Dictionary<string, SData> variables)
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
                        throw new EvalException($"Variable {exp.Var} is not found in parameters.");
                    }

                    result = variable;
                    break;
                case SExpressionType.Func:
                    var method = typeof(SFunctions).GetMethod(exp.FuncName);
                    if (method == null)
                    {
                        throw new EvalException($"{exp.FuncName} is not a valid function name.");
                    }

                    var args = new List<SData>();

                    foreach (var argExp in exp.FuncArgs)
                    {
                        args.Add(await EvalExpressionAsync(argExp, variables));
                    }

                    try
                    {
                        result = (SData) method.Invoke(null, args.ToArray<object>());
                    }
                    catch (Exception e)
                    {
                        throw new EvalException($"Eval error when invoking function {exp.FuncName}.", e);
                    }

                    break;
            }

            return await Task.FromResult(result);
        }

        private async Task<SData> ConvertToSDataAsync(JToken value, SDataType dataType)
        {
            SData result = null;

            try
            {
                switch (dataType)
                {
                    case SDataType.Bool:
                        result = new SBool(value.Value<bool>());
                        break;
                    case SDataType.DateTime:
                        result = new SDateTime(value.Value<DateTime>());
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
                        result = new SStringDict(value.ToDictionary(i => ((JProperty) i).Name, i => ((JProperty) i).Value.Value<string>()));
                        break;
                    case SDataType.StringList:
                        result = new SStringList(value.Select(i => i.Value<string>()).ToList());
                        break;
                }
            }
            catch (Exception e)
            {
                throw new EvalException($"Cannot convert {value.ToString()} to data type {dataType.ToString()}.", e);
            }

            return await Task.FromResult(result);
        }
    }
}