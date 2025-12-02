// app/test-backend/page.tsx
// Test page to verify backend connection

'use client';

import { useApi } from '@/hooks/use-api';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface UserProfile {
    id: string;
    user_id: string;
    email: string;
    account_type: string;
    created_at: string;
}

export default function TestBackendPage() {
    const { callApi, loading, error } = useApi();
    const { user, isLoaded } = useUser();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [healthStatus, setHealthStatus] = useState<any>(null);
    const [testResults, setTestResults] = useState<string[]>([]);

    const addResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    // Test 1: Health Check (no auth required)
    const testHealthCheck = async () => {
        addResult('Testing health check endpoint...');
        try {
            const response = await fetch('http://localhost:5000/health');
            const data = await response.json();
            setHealthStatus(data);
            addResult('✅ Health check successful!');
        } catch (err: any) {
            addResult(`❌ Health check failed: ${err.message}`);
        }
    };

    // Test 2: Get User Profile (auth required)
    const testGetProfile = async () => {
        if (!isLoaded || !user) {
            addResult('⚠️ Please log in first');
            return;
        }

        addResult('Testing authenticated API call...');
        const result = await callApi<UserProfile>('get', '/api/users/profile');

        if (result.success) {
            setProfile(result.data || null);
            addResult('✅ Profile loaded successfully!');
        } else {
            addResult(`❌ Profile load failed: ${result.error}`);
        }
    };

    // Test 3: Update Profile (auth required)
    const testUpdateProfile = async () => {
        if (!profile) {
            addResult('⚠️ Load profile first');
            return;
        }

        addResult('Testing profile update...');
        const result = await callApi('put', '/api/users/profile', {
            bio: `Updated at ${new Date().toISOString()}`
        });

        if (result.success) {
            addResult('✅ Profile updated successfully!');
        } else {
            addResult(`❌ Profile update failed: ${result.error}`);
        }
    };

    useEffect(() => {
        testHealthCheck();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Backend Connection Test</h1>
                <p className="text-gray-600 mb-8">
                    Testing connection between frontend and Express.js backend
                </p>

                {/* Connection Status */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Connection Status</h2>

                    {healthStatus ? (
                        <div className="bg-green-50 border border-green-200 rounded p-4">
                            <p className="text-green-800 font-semibold">✅ Backend Connected</p>
                            <p className="text-sm text-green-600 mt-2">
                                Server: {healthStatus.status} | Environment: {healthStatus.environment}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {healthStatus.timestamp}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                            <p className="text-yellow-800">⏳ Checking connection...</p>
                        </div>
                    )}
                </div>

                {/* User Status */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>

                    {!isLoaded ? (
                        <p className="text-gray-500">Loading user...</p>
                    ) : user ? (
                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                            <p className="text-blue-800 font-semibold">✅ Logged In</p>
                            <p className="text-sm text-blue-600 mt-2">
                                {user.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded p-4">
                            <p className="text-red-800 font-semibold">❌ Not Logged In</p>
                            <p className="text-sm text-red-600 mt-2">
                                Please log in to test authenticated endpoints
                            </p>
                        </div>
                    )}
                </div>

                {/* Test Buttons */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">API Tests</h2>

                    <div className="space-y-3">
                        <button
                            onClick={testHealthCheck}
                            className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                        >
                            Test 1: Health Check (No Auth)
                        </button>

                        <button
                            onClick={testGetProfile}
                            disabled={!user || loading}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Test 2: Get User Profile (Auth Required)
                        </button>

                        <button
                            onClick={testUpdateProfile}
                            disabled={!profile || loading}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Test 3: Update Profile (Auth Required)
                        </button>
                    </div>

                    {loading && (
                        <div className="mt-4 text-center text-gray-600">
                            <p>⏳ Loading...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded p-4">
                            <p className="text-red-800 font-semibold">Error:</p>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    )}
                </div>

                {/* Profile Data */}
                {profile && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Profile Data</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                            {JSON.stringify(profile, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Test Results Log */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Test Log</h2>
                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-auto">
                        {testResults.length === 0 ? (
                            <p className="text-gray-500">No tests run yet...</p>
                        ) : (
                            testResults.map((result, index) => (
                                <div key={index} className="mb-1">
                                    {result}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">How to Use:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                        <li>Test 1 should work immediately (no login required)</li>
                        <li>Log in to your account to enable Tests 2 and 3</li>
                        <li>Test 2 fetches your profile from the backend</li>
                        <li>Test 3 updates your profile bio</li>
                        <li>Check the test log for detailed results</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
