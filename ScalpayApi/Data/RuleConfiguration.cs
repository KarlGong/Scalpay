using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using Scalpay.Models;
using Scalpay.Models.SExpressions;

namespace Scalpay.Data
{
    public class RuleConfiguration : IEntityTypeConfiguration<Rule>
    {
        public void Configure(EntityTypeBuilder<Rule> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Condition).HasConversion(
                v => JsonConvert.SerializeObject(v),
                v => JsonConvert.DeserializeObject<SExpression>(v))
                .IsRequired();
            
            builder.Property(r => r.Result).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<SExpression>(v))
                .IsRequired();

            builder.Property(r => r.Order).IsRequired();

            builder.Property(r => r.InsertTime).IsRequired();

            builder.Property(r => r.UpdateTime).IsRequired();

            builder.Property(r => r.ItemKey).IsRequired();
            builder.HasIndex(r => r.ItemKey);
        }
    }
}