import {
    Car,
    Home,
    Wrench,
    Smartphone,
    Shirt,
    Music,
    PartyPopper,
    Camera,
    Dumbbell,
    Baby,
    Briefcase,
    Bike,
    Globe,
    LucideIcon
} from 'lucide-react-native';

export const IconMap: Record<string, LucideIcon> = {
    'Car': Car,
    'Home': Home,
    'Wrench': Wrench,
    'Smartphone': Smartphone,
    'Shirt': Shirt,
    'Music': Music,
    'PartyPopper': PartyPopper,
    'Camera': Camera,
    'Dumbbell': Dumbbell,
    'Baby': Baby,
    'Briefcase': Briefcase,
    'Bike': Bike,
    'Globe': Globe,
};

export const getIcon = (name: string): LucideIcon => {
    return IconMap[name] || Wrench;
};
