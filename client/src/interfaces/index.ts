export interface UserTypeProps {
    _id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PlanetTypeProps {
    _id: string;
    name: string;
    description: string;
    images: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
    targetAmount: number;
    collectedAmount: number;
    organizer: string;
}

export interface PaymentTypeProps{
    _id: string;
    amount: number;
    planet: PlanetTypeProps;
    user: UserTypeProps;
    createdAt: string;
    updatedAt: string;
}