import IdVerificationForm from '@/components/id-verification-form';

export default function TestOCRPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center">OCR Service Test</h1>
            <IdVerificationForm />
        </div>
    );
}
