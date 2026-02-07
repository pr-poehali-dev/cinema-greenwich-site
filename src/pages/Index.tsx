import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Movie {
  id: string;
  title: string;
  time: string;
  price: number;
}

interface BarItem {
  name: string;
  price: number;
  unit?: string;
}

interface TicketData {
  ticketNumber: string;
  movie: string;
  date: string;
  time: string;
  seats: number[];
  email: string;
  total: number;
}

const movies: Movie[] = [
  { id: '1', title: 'Зверополис 2', time: '9:30', price: 650 },
  { id: '2', title: 'Чебурашка 2', time: '11:55', price: 450 },
  { id: '3', title: 'Гренландия 2: Миграция', time: '14:05', price: 450 },
  { id: '4', title: 'Буратино', time: '16:00', price: 450 },
  { id: '5', title: 'Папины дочки: Мама вернулась', time: '18:05', price: 450 },
  { id: '6', title: 'Зверополис 2', time: '20:10', price: 650 },
  { id: '7', title: 'Возвращение в Сайлент-Хилл', time: '22:15', price: 650 },
  { id: '8', title: 'Убежище', time: '0:20', price: 650 },
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
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(new Set());
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

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

  const handleContinueToEmail = () => {
    if (selectedSeats.length === 0) {
      toast.error('Выберите хотя бы одно место');
      return;
    }
    setShowSeatSelection(false);
    setShowEmailDialog(true);
  };

  const generateTicketNumber = () => {
    return `GW${Date.now().toString().slice(-8)}`;
  };

  const handlePurchase = () => {
    if (!email || !email.includes('@')) {
      toast.error('Укажите корректный email');
      return;
    }

    const total = selectedSeats.length * (selectedMovie?.price || 0);
    const ticketNumber = generateTicketNumber();
    
    // Сохраняем забронированные места
    const newBookedSeats = new Set(bookedSeats);
    selectedSeats.forEach(seat => {
      newBookedSeats.add(`${selectedDate}-${selectedMovie?.id}-${seat}`);
    });
    setBookedSeats(newBookedSeats);

    // Данные билета
    const ticket = {
      ticketNumber,
      movie: selectedMovie?.title,
      date: new Date(selectedDate).toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: selectedMovie?.time,
      seats: selectedSeats.sort((a, b) => a - b),
      email,
      total,
    };

    setTicketData(ticket);
    setShowEmailDialog(false);
    setShowTicketDialog(true);
    setSelectedSeats([]);
    setEmail('');

    // Имитация отправки на email
    toast.success('Билет отправлен на вашу почту!', { duration: 5000 });
  };

  const isSeatBooked = (seatNumber: number): boolean => {
    return bookedSeats.has(`${selectedDate}-${selectedMovie?.id}-${seatNumber}`);
  };

  const closeAllDialogs = () => {
    setShowSeatSelection(false);
    setShowEmailDialog(false);
    setShowTicketDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Гринвич Синема
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Екатеринбург</p>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#schedule" className="text-sm font-medium hover:text-primary transition-colors">
                Афиша
              </a>
              <a href="#bar" className="text-sm font-medium hover:text-secondary transition-colors">
                Бар
              </a>
              <a href="#contacts" className="text-sm font-medium hover:text-accent transition-colors">
                Контакты
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6 border border-primary/30">
            <Icon name="Sparkles" size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Премиум качество</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Гринвич Синема
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Зал на <span className="text-primary font-bold">460 мест</span> • 
            Работаем <span className="text-secondary font-bold">с 9:00 до 2:00</span> • 
            ТРЦ Гринвич
          </p>
          <Button 
            size="lg" 
            className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:shadow-primary/50 transition-all"
            onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Icon name="Ticket" className="mr-2" size={24} />
            Купить билет
          </Button>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Расписание сеансов
            </h3>
            <p className="text-muted-foreground">Выберите дату и фильм</p>
          </div>
          
          {/* Date selector */}
          <div className="flex gap-4 justify-center mb-12 flex-wrap">
            {dates.map((date) => (
              <Button
                key={date.value}
                variant={selectedDate === date.value ? 'default' : 'outline'}
                onClick={() => setSelectedDate(date.value)}
                className={`flex flex-col h-auto py-4 px-8 transition-all ${
                  selectedDate === date.value 
                    ? 'bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30' 
                    : 'hover:border-primary'
                }`}
              >
                <span className="text-xs opacity-70 uppercase tracking-wider">{date.weekday}</span>
                <span className="text-xl font-bold mt-1">{date.label}</span>
              </Button>
            ))}
          </div>

          {/* Movies grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Card 
                key={movie.id} 
                className="p-6 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all group bg-gradient-to-br from-card to-card/80"
              >
                <div className="mb-5">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      {movie.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className="ml-2 text-lg font-bold bg-gradient-to-r from-secondary to-accent text-white border-0"
                    >
                      {movie.time}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg border border-primary/30">
                    <Icon name="Ticket" size={18} className="text-primary" />
                    <span className="text-2xl font-bold text-primary">{movie.price} ₽</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all" 
                  onClick={() => handleBuyTicket(movie)}
                >
                  <Icon name="ShoppingCart" className="mr-2" size={18} />
                  Купить билет
                </Button>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10 bg-card/50 backdrop-blur-sm py-3 px-6 rounded-lg inline-block mx-auto">
            <Icon name="Calendar" size={14} className="inline mr-2" />
            Расписание действует до 12 февраля 2026 года
          </p>
        </div>
      </section>

      {/* Bar Menu */}
      <section id="bar" className="py-20 border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Меню бар
            </h3>
            <p className="text-muted-foreground">Попкорн, напитки и сладости</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {barMenu.map((item, index) => (
              <Card 
                key={index} 
                className="p-6 flex items-center justify-between hover:border-secondary hover:shadow-xl hover:shadow-secondary/20 transition-all bg-gradient-to-br from-card to-card/80"
              >
                <div>
                  <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                  {item.unit && <p className="text-xs text-muted-foreground">{item.unit}</p>}
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  {item.price} ₽
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Контакты
            </h3>
            <p className="text-muted-foreground">Ждём вас в ТРЦ Гринвич</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center hover:shadow-xl hover:shadow-primary/20 transition-all bg-gradient-to-br from-card to-card/80">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={32} className="text-background" />
              </div>
              <h4 className="font-bold text-lg mb-3">Адрес</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                г. Екатеринбург<br />
                ул. 8 Марта, 46<br />
                ТРЦ Гринвич
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl hover:shadow-secondary/20 transition-all bg-gradient-to-br from-card to-card/80">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={32} className="text-background" />
              </div>
              <h4 className="font-bold text-lg mb-3">Режим работы</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ежедневно<br />
                с 9:00 до 2:00
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl hover:shadow-accent/20 transition-all bg-gradient-to-br from-card to-card/80">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-background" />
              </div>
              <h4 className="font-bold text-lg mb-3">Зал</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                460 мест<br />
                Премиум-класс
              </p>
            </Card>
          </div>
          <div className="mt-10 text-center text-sm text-muted-foreground bg-card/50 backdrop-blur-sm py-4 px-6 rounded-lg inline-block">
            <Icon name="Info" size={14} className="inline mr-2" />
            Кассы открываются за 30 минут до начала сеанса и закрываются за 30 минут до конца последнего сеанса
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Гринвич Синема. Все права защищены.</p>
        </div>
      </footer>

      {/* Seat Selection Dialog */}
      <Dialog open={showSeatSelection} onOpenChange={(open) => !open && closeAllDialogs()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {selectedMovie?.title} • {selectedMovie?.time}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} • 
              Цена: <span className="text-primary font-bold">{selectedMovie?.price} ₽</span>
            </p>
          </DialogHeader>

          <div className="py-6">
            <div className="mb-8">
              <div className="bg-gradient-to-r from-primary/30 to-secondary/30 text-center py-4 rounded-xl mb-8 border border-primary/30">
                <Icon name="Monitor" size={24} className="inline mr-2 text-primary" />
                <span className="text-lg font-bold">ЭКРАН</span>
              </div>

              {/* Seats Grid */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Array.from({ length: 23 }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2 justify-center">
                    <span className="w-10 text-center text-sm font-semibold text-muted-foreground pt-2">
                      {rowIndex + 1}
                    </span>
                    {Array.from({ length: 20 }, (_, seatIndex) => {
                      const seatNumber = rowIndex * 20 + seatIndex + 1;
                      const isSelected = selectedSeats.includes(seatNumber);
                      const isBooked = isSeatBooked(seatNumber);

                      return (
                        <button
                          key={seatNumber}
                          onClick={() => !isBooked && toggleSeat(seatNumber)}
                          disabled={isBooked}
                          className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                            isBooked
                              ? 'bg-muted/50 cursor-not-allowed text-muted-foreground/50'
                              : isSelected
                              ? 'bg-gradient-to-br from-primary to-secondary text-background shadow-lg scale-110'
                              : 'bg-secondary hover:bg-secondary/80 hover:scale-105'
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
            <div className="flex gap-8 justify-center mb-6 text-sm bg-card/50 backdrop-blur-sm p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary rounded-lg"></div>
                <span className="font-medium">Свободно</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg"></div>
                <span className="font-medium">Выбрано</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted/50 rounded-lg"></div>
                <span className="font-medium">Занято</span>
              </div>
            </div>

            {/* Summary */}
            {selectedSeats.length > 0 && (
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 rounded-xl p-6 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Выбрано мест:</span>
                  <span className="font-bold text-lg">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Итого:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {selectedSeats.length * (selectedMovie?.price || 0)} ₽
                  </span>
                </div>
              </div>
            )}

            <Button
              className="w-full py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:shadow-primary/50 transition-all"
              onClick={handleContinueToEmail}
              disabled={selectedSeats.length === 0}
            >
              <Icon name="ArrowRight" className="mr-2" size={20} />
              Продолжить к оплате
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={(open) => !open && closeAllDialogs()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Укажите email
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Электронный билет будет отправлен на вашу почту
            </p>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block">Email адрес</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-lg"
              />
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Фильм:</span>
                <span className="font-semibold">{selectedMovie?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Места:</span>
                <span className="font-semibold">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-medium">Итого:</span>
                <span className="text-xl font-bold text-primary">
                  {selectedSeats.length * (selectedMovie?.price || 0)} ₽
                </span>
              </div>
            </div>

            <Button
              className="w-full py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:shadow-primary/50 transition-all"
              onClick={handlePurchase}
            >
              <Icon name="CreditCard" className="mr-2" size={20} />
              Оплатить и получить билет
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={(open) => !open && closeAllDialogs()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Check" size={32} className="text-background" />
              </div>
              <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Билет успешно забронирован!
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="py-6">
            <div className="bg-gradient-to-br from-card to-card/80 border-2 border-primary/30 rounded-2xl p-6 space-y-4">
              <div className="text-center pb-4 border-b border-border">
                <h3 className="text-2xl font-bold mb-1">{ticketData?.movie}</h3>
                <p className="text-sm text-muted-foreground">{ticketData?.date}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Номер билета</span>
                  <span className="font-mono font-bold text-primary">{ticketData?.ticketNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Время сеанса</span>
                  <span className="font-bold">{ticketData?.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Места</span>
                  <span className="font-bold">{ticketData?.seats?.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-bold text-sm">{ticketData?.email}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="font-medium">Итого</span>
                  <span className="text-2xl font-bold text-primary">{ticketData?.total} ₽</span>
                </div>
              </div>

              <div className="pt-4 text-center">
                <div className="bg-background/50 backdrop-blur-sm p-3 rounded-lg">
                  <Icon name="Mail" size={20} className="inline mr-2 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Билет отправлен на {ticketData?.email}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-6 bg-gradient-to-r from-primary to-secondary"
              onClick={closeAllDialogs}
            >
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}