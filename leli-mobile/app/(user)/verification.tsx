import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, UserCheck, FileText, Clock, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import BackButton from '../../components/ui/BackButton';
import { useUser } from '../../context/UserContext';
import { router } from 'expo-router';

const StyledSafeAreaView = styled(SafeAreaView);

export default function VerificationScreen() {
    const { isVerified } = useUser();

    const verificationSteps = [
        {
            title: "Identity Verification",
            description: "Verify your government-issued ID to build trust.",
            status: isVerified ? "Completed" : "Pending",
            icon: UserCheck,
            completed: isVerified
        },
        {
            title: "Property Ownership",
            description: "Upload title deeds or utility bills for your listings.",
            status: isVerified ? "Completed" : "In Progress",
            icon: FileText,
            completed: isVerified
        },
        {
            title: "Background Check",
            description: "Safety first. We perform a routine background check.",
            status: isVerified ? "Completed" : "Starting soon",
            icon: ShieldCheck,
            completed: isVerified
        }
    ];

    return (
        <View className="flex-1">
            <ScreenBackground />
            <StyledSafeAreaView className="flex-1">
                <View className="px-6 pt-4">
                    <BackButton label="Account Verification" />
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <View className="mb-8 items-center">
                        <View className={`w-20 h-20 ${isVerified ? 'bg-blue-100' : 'bg-orange-100'} rounded-full items-center justify-center mb-4`}>
                            {isVerified ? (
                                <ShieldCheck size={40} color="#3B82F6" strokeWidth={2} />
                            ) : (
                                <Clock size={40} color="#F97316" strokeWidth={2} />
                            )}
                        </View>
                        <Text className="text-2xl font-outfit-bold text-slate-900 text-center">
                            {isVerified ? "Verified Owner" : "Get Verified"}
                        </Text>
                        <Text className="text-slate-500 text-center font-outfit mt-2 max-w-[280px]">
                            {isVerified
                                ? "Your account is fully verified. You have maximum listing visibility and trust."
                                : "Complete the verification process to unlock advanced features and boost your property's trust score."}
                        </Text>
                    </View>

                    <View className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 mb-8">
                        <View className="flex-row items-center mb-6">
                            <View className="w-1 h-6 bg-orange-500 rounded-full mr-3" />
                            <Text className="text-lg font-outfit-bold text-slate-800">Verification Steps</Text>
                        </View>

                        {verificationSteps.map((step, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`flex-row items-center p-4 bg-white rounded-2xl mb-3 border ${step.completed ? 'border-blue-100' : 'border-slate-100'} shadow-sm`}
                            >
                                <View className={`w-10 h-10 ${step.completed ? 'bg-blue-50' : 'bg-slate-50'} rounded-xl items-center justify-center mr-4`}>
                                    <step.icon size={20} color={step.completed ? '#3B82F6' : '#64748B'} />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-outfit-bold text-slate-800 text-sm leading-tight">{step.title}</Text>
                                    <Text className="font-outfit text-slate-500 text-[11px] mt-0.5">{step.description}</Text>
                                </View>
                                <View className="items-end ml-2">
                                    {step.completed ? (
                                        <CheckCircle2 size={16} color="#10B981" />
                                    ) : (
                                        <AlertCircle size={16} color="#F97316" />
                                    )}
                                    <Text className={`text-[9px] font-outfit-bold mt-1 uppercase ${step.completed ? 'text-emerald-600' : 'text-orange-600'}`}>
                                        {step.status}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {!isVerified && (
                        <TouchableOpacity
                            className="bg-orange-500 py-4 rounded-2xl items-center shadow-lg shadow-orange-200"
                        >
                            <Text className="text-white font-outfit-bold text-base">Start Verification Process</Text>
                        </TouchableOpacity>
                    )}

                    <View className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex-row items-start">
                        <AlertCircle size={18} color="#3B82F6" className="mr-3 mt-0.5" />
                        <View className="flex-1">
                            <Text className="text-blue-800 font-outfit-bold text-xs uppercase tracking-wider mb-1">Why Verify?</Text>
                            <Text className="text-blue-600 font-outfit text-[11px] leading-relaxed">
                                Verified owners receive 3x more bookings on average and are eligible for our &quot;Premium Host&quot; badge. Your data is encrypted and handled securely.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </StyledSafeAreaView>
        </View>
    );
}
