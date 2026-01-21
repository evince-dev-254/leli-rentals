'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Upload, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface OCRResult {
    raw_text: string;
    extracted_id: string | null;
    extracted_dates: string[];
    lines: string[];
}

interface OCRResponse {
    status: 'success' | 'error';
    data?: OCRResult;
    message?: string;
}

export default function IdVerificationForm() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<OCRResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleVerify = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // NOTE: Replace this URL with your actual Python service URL in production
            // e.g., 'https://ocr.your-domain.com/verify-id'
            const apiUrl = 'http://localhost:8000/verify-id';

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data: OCRResponse = await response.json();

            if (data.status === 'success' && data.data) {
                setResult(data.data);
            } else {
                setError(data.message || 'Failed to process image');
            }

        } catch (err) {
            console.error('Verification failed', err);
            setError('Connection to OCR service failed. Make sure the Python service is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>ID Verification</CardTitle>
                <CardDescription>
                    Upload an image of your National ID or Passport to verify your identity.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {preview ? (
                        <>
                            <div className="relative h-48 w-full">
                                <Image
                                    src={preview}
                                    alt="ID Preview"
                                    fill
                                    className="object-contain rounded"
                                    unoptimized
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload ID image</p>
                            <p className="text-xs text-gray-400 mt-1">JPEG or PNG only</p>
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleVerify}
                    disabled={!file || loading}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Verify ID'
                    )}
                </Button>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {result && (
                    <div className="bg-green-50 p-4 rounded-md border border-green-200 space-y-2">
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Analysis Complete</span>
                        </div>

                        <div className="text-sm space-y-1 text-gray-700">
                            <p><span className="font-semibold">ID Number Found:</span> {result.extracted_id || "None"}</p>
                            {result.extracted_dates.length > 0 && (
                                <p><span className="font-semibold">Dates Found:</span> {result.extracted_dates.join(", ")}</p>
                            )}
                        </div>

                        <details className="text-xs text-gray-500 mt-2">
                            <summary className="cursor-pointer hover:text-gray-700">View Raw Text</summary>
                            <pre className="mt-1 whitespace-pre-wrap bg-white p-2 border rounded overflow-x-auto">
                                {result.raw_text}
                            </pre>
                        </details>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
