import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Movie {
  id: string;
  title: string;
  time: string;
  priceBefore: number;
  priceAfter: number;
}

interface BarItem {
  name: string;
  price: number;
  unit?: string;
}

const movies: Movie[] = [
  { id: '1', title: 'Зверополис 2', time: '9:30', priceBefore: 450, priceAfter: 650 },
  { id: '2', title: 'Чебурашка 2', time: '11:55', priceBefore: 450, priceAfter: 650 },
  { id: '3', title: 'Гренландия 2: Миграция', time: '14:05', priceBefore: 450, priceAfter: 650 },
  { id: '4', title: 'Буратино', time: '16:00', priceBefore: 450, priceAfter: 650 },
  { id: '5', title: 'Папины дочки: Мама вернулась', time: '18:05', priceBefore: 450, priceAfter: 650 },
  { id: '6', title: 'Зверополис 2', time: '20:10', priceBefore: 450, priceAfter: 650 },
  { id: '7', title: 'Возвращение в Сайлент-Хилл', time: '22:15', priceBefore: 450, priceAfter: 650 },
  { id: '8', title: 'Убежище', time: '0:20', priceBefore: 450, priceAfter: 650 },
];

const barMenu: BarItem[] = [
  { name: 'Попкорн маленький', price: 330 },
  { name: 'Попкорн средний', price: 390 },
  { name: 'Попкорн большой', price: 450 },
  { name: 'Сладкая вата', price: 250 },
  { name: 'Кока-кола', price: 120 },
  { name: 'Мармеладки', price: 280, unit: '100 г' },
];

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-02-08');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  const generateDates = () => {
    const dates = [];
    const start = new Date('2026-02-08');
    for (let i = 0; i < 5; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        weekday: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
      });
    }
    return dates;
  };

  const dates = generateDates();

  const handleBuyTicket = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedSeats([]);
    setShowSeatSelection(true);
  };

  const toggleSeat = (seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handlePurchase = () => {
    if (selectedSeats.length === 0) {
      toast.error('Выберите хотя бы одно место');
      return;
    }
    
    const total = selectedSeats.length * (selectedMovie?.priceAfter || 0);
    toast.success(
      `Билет успешно забронирован! Места: ${selectedSeats.join(', ')}. Сумма: ${total} ₽`,
      { duration: 5000 }
    );
    setShowSeatSelection(false);
    setSelectedSeats([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Гринвич Синема</h1>
              <p className="text-sm text-muted-foreground mt-1">Екатеринбург</p>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#schedule" className="text-sm hover:text-primary transition-colors">
                Афиша
              </a>
              <a href="#bar" className="text-sm hover:text-primary transition-colors">
                Бар
              </a>
              <a href="#contacts" className="text-sm hover:text-primary transition-colors">
                Контакты
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            Кинотеатр <span className="text-primary">премиум-класса</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Зал на 460 мест • Работаем с 9:00 до 2:00 • ТРЦ Гринвич
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}>
            <Icon name="Ticket" className="mr-2" size={20} />
            Купить билет
          </Button>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold mb-12 text-center">Расписание сеансов</h3>
          
          {/* Date selector */}
          <div className="flex gap-4 justify-center mb-12 flex-wrap">
            {dates.map((date) => (
              <Button
                key={date.value}
                variant={selectedDate === date.value ? 'default' : 'outline'}
                onClick={() => setSelectedDate(date.value)}
                className="flex flex-col h-auto py-3 px-6"
              >
                <span className="text-xs opacity-70">{date.weekday}</span>
                <span className="text-lg font-bold">{date.label}</span>
              </Button>
            ))}
          </div>

          {/* Movies grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Card key={movie.id} className="p-6 hover:border-primary transition-all">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold leading-tight">{movie.title}</h4>
                    <Badge variant="secondary" className="ml-2 text-lg font-bold">
                      {movie.time}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2 text-sm text-muted-foreground">
                    <span>До сеанса:</span>
                    <span className="text-primary font-semibold">{movie.priceBefore} ₽</span>
                  </div>
                  <div className="flex items-baseline gap-2 text-sm text-muted-foreground">
                    <span>После:</span>
                    <span className="font-semibold">{movie.priceAfter} ₽</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => handleBuyTicket(movie)}>
                  <Icon name="ShoppingCart" className="mr-2" size={16} />
                  Купить билет
                </Button>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            * Расписание действует до 12 февраля 2026 года
          </p>
        </div>
      </section>

      {/* Bar Menu */}
      <section id="bar" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold mb-12 text-center">Меню бар</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {barMenu.map((item, index) => (
              <Card key={index} className="p-6 flex items-center justify-between hover:border-primary transition-all">
                <div>
                  <h4 className="font-semibold mb-1">{item.name}</h4>
                  {item.unit && <p className="text-xs text-muted-foreground">{item.unit}</p>}
                </div>
                <span className="text-2xl font-bold text-primary">{item.price} ₽</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold mb-12 text-center">Контакты</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <Icon name="MapPin" size={32} className="mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">Адрес</h4>
              <p className="text-sm text-muted-foreground">
                г. Екатеринбург<br />
                ул. 8 Марта, 46<br />
                ТРЦ Гринвич
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Icon name="Clock" size={32} className="mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">Режим работы</h4>
              <p className="text-sm text-muted-foreground">
                Ежедневно<br />
                с 9:00 до 2:00
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Icon name="Users" size={32} className="mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">Зал</h4>
              <p className="text-sm text-muted-foreground">
                460 мест<br />
                Премиум-класс
              </p>
            </Card>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Кассы открываются за 30 минут до начала сеанса</p>
            <p>и закрываются за 30 минут до конца последнего сеанса</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Гринвич Синема. Все права защищены.</p>
        </div>
      </footer>

      {/* Seat Selection Dialog */}
      <Dialog open={showSeatSelection} onOpenChange={setShowSeatSelection}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedMovie?.title} • {selectedMovie?.time}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedDate} • Цена: {selectedMovie?.priceAfter} ₽
            </p>
          </DialogHeader>

          <div className="py-6">
            <div className="mb-8">
              <div className="bg-primary/20 text-center py-3 rounded-lg mb-6">
                <span className="text-sm font-semibold">ЭКРАН</span>
              </div>

              {/* Seats Grid */}
              <div className="space-y-2">
                {Array.from({ length: 23 }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2 justify-center">
                    <span className="w-8 text-center text-sm text-muted-foreground pt-2">
                      {rowIndex + 1}
                    </span>
                    {Array.from({ length: 20 }, (_, seatIndex) => {
                      const seatNumber = rowIndex * 20 + seatIndex + 1;
                      const isSelected = selectedSeats.includes(seatNumber);
                      const isOccupied = Math.random() > 0.7; // Random occupied seats for demo

                      return (
                        <button
                          key={seatNumber}
                          onClick={() => !isOccupied && toggleSeat(seatNumber)}
                          disabled={isOccupied}
                          className={`w-8 h-8 rounded text-xs transition-all ${
                            isOccupied
                              ? 'bg-muted cursor-not-allowed'
                              : isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {seatIndex + 1}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 justify-center mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary rounded"></div>
                <span>Свободно</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded"></div>
                <span>Выбрано</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-muted rounded"></div>
                <span>Занято</span>
              </div>
            </div>

            {/* Summary */}
            {selectedSeats.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Выбрано мест:</span>
                  <span className="font-semibold">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Итого:</span>
                  <span className="text-2xl font-bold text-primary">
                    {selectedSeats.length * (selectedMovie?.priceAfter || 0)} ₽
                  </span>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handlePurchase}
              disabled={selectedSeats.length === 0}
            >
              <Icon name="CreditCard" className="mr-2" size={20} />
              Оплатить и забронировать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
