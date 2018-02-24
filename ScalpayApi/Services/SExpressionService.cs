using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;
using ScalpayApi.Services.SExpression;

namespace ScalpayApi.Services
{
    public interface ISExpressionService
    {
        SData Eval(JToken exp, Dictionary<string, SData> variables);
    }

    public class SExpressionService : ISExpressionService
    {
        public SData Eval(JToken exp, Dictionary<string, SData> variables)
        {
            var type = exp["type"].Value<string>();
            var returnType = exp["return"].Value<string>();

            switch (type)
            {
                case "Value":
                    var valueToken = exp["value"];
                    switch (returnType)
                    {
                        case "Bool":
                            return new SBool(valueToken.Value<bool>());
                        case "DateTime":
                            return new SDateTime(valueToken.Value<string>());
                        case "Duration":
                            return new SDuration(valueToken.Value<string>());
                        case "Number":
                            return new SNumber(valueToken.Value<double>());
                        case "NumberDict":
                            return new SNumberDict(exp["value"].ToDictionary(i => ((JProperty) i).Name,
                                i => ((JProperty) i).Value.Value<double>()));
                        case "NumberList":
                            return new SNumberList(exp["value"].Select(i => i.Value<double>()).ToList());
                        case "String":
                            return new SString(valueToken.Value<string>());
                        case "StringDict":
                            return new SStringDict(exp["value"].ToDictionary(i => ((JProperty) i).Name,
                                i => ((JProperty) i).Value.Value<string>()));
                        case "StringList":
                            return new SStringList(exp["value"].Select(i => i.Value<string>()).ToList());
                        default: throw new Exception(returnType + " is not a valid return type.");
                    }
                case "Var":
                    if (!variables.TryGetValue(exp["var"].Value<string>(), out var variable))
                    {
                        throw new Exception(exp["var"].Value<string>() + " is not a valid variable.");
                    }

                    return variable;
                case "Func":
                    var method = typeof(SFunctions).GetMethod(exp["name"].Value<string>());
                    if (method == null)
                    {
                        throw new Exception(exp["name"].Value<string>() + " is not a valid function name.");
                    }

                    return (SData) method.Invoke(null, exp["args"].Select(a => Eval(a, variables)).ToArray());
                default: throw new Exception(type + " is not a valid expression type.");
            }
        }
    }
}