export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bleu-marine':   '#1B2D6B',
        'bleu-moyen':    '#2A4494',
        'vert-menthe':   '#2EC4B6',
        'vert-fonce':    '#1A9E92',
        'orange-cta':    '#FF6B35',
        'orange-hover':  '#E85A25',
        'blanc-casse':   '#F8F9FA',
        'gris-clair':    '#E9ECEF',
        'gris-moyen':    '#6C757D',
        'gris-fonce':    '#343A40',
        'rouge-charges': '#E63946',
        'jaune-impot':   '#FF9F1C',
      },
      fontFamily: {
        titre: ['Plus Jakarta Sans Variable', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        corps: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        'card-lg': '20px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(27, 45, 107, 0.08)',
        'card-hover': '0 8px 32px rgba(27, 45, 107, 0.14)',
      },
    },
  },
  plugins: [],
};
