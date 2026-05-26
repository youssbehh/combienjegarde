import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ResultatSimulation } from '../../types';

const COLORS = ['#E63946', '#FF9F1C', '#6C757D', '#2EC4B6'];

interface Props {
  resultats: ResultatSimulation;
}

export default function DonutChart({ resultats }: Props) {
  const data = [
    { name: 'Cotisations', value: resultats.cotisationsURSSAF },
    { name: 'Impôt',       value: resultats.impotEstime },
    { name: 'CFE',         value: resultats.cfeEstimee },
    { name: 'Net',         value: resultats.revenuNet },
  ].filter((d) => d.value > 0);

  const total = resultats.cabrut;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
      return (
        <div className="bg-gris-fonce text-white rounded-lg px-3 py-2 text-xs font-corps shadow-lg">
          <p className="font-semibold">{item.name}</p>
          <p>{item.value.toLocaleString('fr-FR')} € ({pct}%)</p>
        </div>
      );
    }
    return null;
  };

  const CenterLabel = () => (
    <g>
      <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" className="fill-gris-fonce" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', fill: '#6C757D' }}>
        Revenu net
      </text>
      <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '18px', fill: '#2EC4B6' }}>
        {resultats.revenuNet.toLocaleString('fr-FR')} €
      </text>
    </g>
  );

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <h3 className="font-titre font-semibold text-bleu-marine mb-4 text-center">Répartition de votre CA</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            isAnimationActive
            animationDuration={400}
            label={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="font-corps text-sm text-gris-fonce">{value}</span>}
          />
          <CenterLabel />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
