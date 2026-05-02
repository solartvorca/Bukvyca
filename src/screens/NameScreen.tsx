import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import BukvitsaCard from '../components/BukvitsaCard';
import { useBukvitsyStore } from '../store/bukvitsyStore';
import { Bukvitsa } from '../types';

export default function NameScreen() {
  const { bukvitsy, addFavorite, removeFavorite, isFavorite } = useBukvitsyStore();
  const [name, setName] = useState<string>('');
  const [letters, setLetters] = useState<Bukvitsa[]>([]);
  const [notFoundLetters, setNotFoundLetters] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleCalculate = () => {
    if (name.trim()) {
      const upperName = name.toUpperCase();
      const found: Bukvitsa[] = [];
      const notFound: string[] = [];

      for (const char of upperName) {
        if (char === ' ' || char === '-') continue;

        const bukvitsa = bukvitsy.find(b => b.letter === char);
        if (bukvitsa) {
          found.push(bukvitsa);
        } else {
          if (!notFound.includes(char)) {
            notFound.push(char);
          }
        }
      }

      setLetters(found);
      setNotFoundLetters(notFound);
      setSubmitted(true);
      localStorage.setItem('user_name', name);
    }
  };

  const handleReset = () => {
    setName('');
    setLetters([]);
    setNotFoundLetters([]);
    setSubmitted(false);
  };

  const toggleFavorite = (id: number) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-bukvitsa-cream mb-2">Буквица Вашего Имени</h1>
        <p className="text-gray-400">Откройте скрытый смысл каждой буквы вашего имени</p>
      </div>

      {!submitted && (
        <div className="max-w-md mx-auto bg-bukvitsa-dark-blue/50 border border-bukvitsa-gold/20 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-bukvitsa-cream font-bold mb-3 text-lg">✨ Введите ваше имя:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
              placeholder="например, МАРИЯ"
              className="w-full bg-bukvitsa-black/50 border border-bukvitsa-gold/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-bukvitsa-gold transition placeholder-gray-500"
            />
          </div>
          <button
            onClick={handleCalculate}
            disabled={!name.trim()}
            className="w-full bg-bukvitsa-red hover:bg-bukvitsa-red/90 disabled:bg-gray-700 disabled:text-gray-600 text-white py-3 rounded-lg font-bold transition active:scale-95"
          >
            🔮 Раскрыть буквицы
          </button>
        </div>
      )}

      {submitted && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-bukvitsa-cream mb-2">
              Буквицы имени «{name}»
            </h2>
            {notFoundLetters.length > 0 && (
              <p className="text-gray-400 text-sm">
                ⚠️ Буквы не найдены в базе: {notFoundLetters.join(', ')} (возможно, иностранные символы)
              </p>
            )}
          </div>

          {letters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {letters.map((bukvitsa) => (
                <div key={bukvitsa.id} onClick={() => toggleFavorite(bukvitsa.id)}>
                  <BukvitsaCard
                    bukvitsa={bukvitsa}
                    isFavorite={isFavorite(bukvitsa.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-bukvitsa-dark-blue/30 rounded-lg border border-bukvitsa-gold/10">
              <p className="text-gray-400">В имени не найдено ни одной буквицы</p>
            </div>
          )}

          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 bg-bukvitsa-gold/20 hover:bg-bukvitsa-gold/30 text-bukvitsa-cream py-3 rounded-lg font-bold transition"
            >
              <ArrowLeft size={20} />
              Назад
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
