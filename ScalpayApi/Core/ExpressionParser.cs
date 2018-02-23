using System;
using System.Linq;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;

namespace ScalpayApi.Core
{
    public class ExpressionParser
    {
        private readonly JToken _expJson;
        private readonly ParameterExpression _input; 

        public ExpressionParser(JToken expJson, ParameterExpression input)
        {
            _expJson = expJson;
            _input = input;
        }

        public Expression Parse()
        {
            var expType = _expJson["expType"].Value<string>();
            var returnType = _expJson["returnType"].Value<string>();

            switch (expType)
            {
                case "Value":
                    switch (returnType)
                    {
                        case "SBool":
                            return Expression.New(typeof(SBool).GetConstructor(new[] {typeof(bool)}),
                                Expression.Constant(_expJson["value"].Value<bool>()));
                        case "SDateTime":
                            return Expression.New(typeof(SDateTime).GetConstructor(new[] {typeof(string)}),
                                Expression.Constant(_expJson["value"].Value<string>()));
                        case "SDuration":
                            return Expression.New(typeof(SDuration).GetConstructor(new[] {typeof(string)}),
                                Expression.Constant(_expJson["value"].Value<string>()));
                        case "SNumber":
                            return Expression.New(typeof(SNumber).GetConstructor(new[] {typeof(double)}),
                                Expression.Constant(_expJson["value"].Value<double>()));
                        case "SString":
                            return Expression.New(typeof(SString).GetConstructor(new[] {typeof(string)}),
                                Expression.Constant(_expJson["value"].Value<string>()));
                        default: throw new Exception(returnType + " is not a valid return type.");
                    }
                case "Var":
                    return _input;
                case "Func":
                    return Expression.Call(
                        null,
                        typeof(Func).GetMethod(_expJson["funcName"].Value<string>()),
                        _expJson["args"].Select(a => new ExpressionParser(a, _input).Parse()).ToArray()
                    );
            }

            return null;
        }
    }
}