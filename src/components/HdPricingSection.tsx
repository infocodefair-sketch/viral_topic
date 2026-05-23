import { BadgeCheck, Crown, MonitorPlay, Sparkles, Zap } from "lucide-react";

const plans = [
  {
    name: "HD Pass",
    price: "$4.99",
    cadence: "week",
    description: "Short-term access for crisp playback and cleaner previews.",
    features: ["HD playback", "Faster previews", "Priority image detail loading"],
    Icon: MonitorPlay,
  },
  {
    name: "Premium HD",
    price: "$12.99",
    cadence: "month",
    description: "The balanced option for regular watching and browsing.",
    features: ["Full HD library", "Watch later access", "Creator collections"],
    Icon: Crown,
    featured: true,
  },
  {
    name: "Ultra Studio",
    price: "$24.99",
    cadence: "month",
    description: "Higher quality access for power users and studio drops.",
    features: ["Ultra quality streams", "Early feature previews", "Top priority playback"],
    Icon: Sparkles,
  },
];

export function HdPricingSection() {
  return (
    <section className="py-6">
      <div className="glass mb-6 rounded-lg p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-orange-300">HD access</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-5xl">Choose your HD plan</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
              Upgrade the viewing experience with sharper playback, faster previews, and priority access to high-quality media.
            </p>
          </div>
          <div className="inline-flex items-center rounded-lg border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200">
            <Zap className="mr-2 size-4" />
            HD options available soon
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-lg border p-5 ${
              plan.featured
                ? "border-orange-400/60 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className={`grid size-11 place-items-center rounded-lg ${plan.featured ? "bg-orange-500 text-black" : "bg-white/10 text-orange-300"}`}>
                <plan.Icon className="size-5" />
              </span>
              {plan.featured ? <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-black uppercase text-black">Best value</span> : null}
            </div>
            <h2 className="mt-5 text-xl font-black">{plan.name}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-neutral-400">{plan.description}</p>
            <div className="mt-5 flex items-end gap-1">
              <span className="text-4xl font-black">{plan.price}</span>
              <span className="pb-1 text-sm text-neutral-500">/ {plan.cadence}</span>
            </div>
            <ul className="mt-5 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-neutral-300">
                  <BadgeCheck className="size-4 shrink-0 text-orange-300" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className={`mt-6 h-11 w-full rounded-lg text-sm font-black transition ${plan.featured ? "bg-orange-500 text-black hover:bg-orange-400" : "bg-white/10 text-white hover:bg-white/15"}`}>
              Select plan
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
