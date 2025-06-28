import { useState } from 'react';
import { GetServerSideProps } from 'next';

interface DebugPageProps {
  nodeEnv: string;
}

export default function DebugPage({ nodeEnv }: DebugPageProps) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async (endpoint: string, method: string = 'GET') => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error) {
      setResult({ 
        status: 'ERROR', 
        data: { error: error instanceof Error ? error.message : 'Unknown error' } 
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Database Debug Panel</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <p><strong>NODE_ENV:</strong> {nodeEnv}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Database Tests</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => runTest('/api/debug/check-users')}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Check Users
              </button>
              
              <button
                onClick={() => runTest('/api/debug/setup-database', 'POST')}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Setup Database
              </button>
              
              <button
                onClick={() => runTest('/api/debug/create-test-user', 'POST')}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Create Test User
              </button>
              
              <button
                onClick={() => runTest('/api/test-db')}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Test DB Connection
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Running test...</span>
              </div>
            )}
            
            {result && !loading && (
              <div className="bg-gray-50 rounded p-4">
                <div className="mb-2">
                  <strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    result.status === 200 ? 'bg-green-100 text-green-800' : 
                    result.status === 'ERROR' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <div>
                  <strong>Response:</strong>
                  <pre className="mt-2 bg-white p-3 rounded border text-sm overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Quick Start Guide</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Klik <strong>"Setup Database"</strong> untuk membuat tabel-tabel yang diperlukan</li>
            <li>Klik <strong>"Create Test User"</strong> untuk membuat user test (email: test@example.com, password: 123456)</li>
            <li>Klik <strong>"Check Users"</strong> untuk melihat user yang tersedia</li>
            <li>Coba login dengan credentials test user</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      nodeEnv: process.env.NODE_ENV || 'development',
    },
  };
};
