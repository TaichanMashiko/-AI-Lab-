import React, { useState } from 'react';
import { findStudentByEmail } from './services/sheetService';
import { Student, AppState } from './types';
import { Eye, EyeOff, Search, User, Key, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(true); // Default to showing password as requested
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setAppState(AppState.LOADING);
    setErrorMessage('');
    setStudentData(null);

    try {
      const student = await findStudentByEmail(email);
      
      if (student) {
        setStudentData(student);
        setAppState(AppState.SUCCESS);
      } else {
        setAppState(AppState.NOT_FOUND);
      }
    } catch (err) {
      setAppState(AppState.ERROR);
      setErrorMessage('データベースへの接続に失敗しました。時間をおいて再度お試しください。');
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setStudentData(null);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-6 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">アカウント確認</h1>
          <p className="text-blue-100 text-sm mt-1">生徒用 ID・パスワード照会</p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          
          {appState === AppState.IDLE || appState === AppState.LOADING || appState === AppState.NOT_FOUND || appState === AppState.ERROR ? (
            <form onSubmit={handleSearch} className="space-y-6">
              
              <div className="text-center mb-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                  以下をクリックして、お使いのGoogleアカウント（メールアドレス）を選択してください。
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@school.edu"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  ※ ブラウザに保存されたメールアドレスが自動的に候補として表示されます。
                </p>
              </div>

              {appState === AppState.NOT_FOUND && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>このメールアドレスのアカウントは見つかりませんでした。入力内容を確認してください。</span>
                </div>
              )}

              {appState === AppState.ERROR && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={appState === AppState.LOADING}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {appState === AppState.LOADING ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    確認中...
                  </span>
                ) : (
                  '確認する'
                )}
              </button>
            </form>
          ) : (
            // SUCCESS STATE
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-center text-green-600 mb-2">
                <CheckCircle className="w-12 h-12" />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">ようこそ<br/>{studentData?.name} さん</h2>
                <p className="text-gray-500 text-sm mt-1">出席番号: {studentData?.studentNumber}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
                {/* ID Row */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">ログインID</p>
                      <p className="text-gray-900 font-mono font-bold text-lg">{studentData?.id}</p>
                    </div>
                  </div>
                </div>

                {/* Password Row */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-md">
                      <Key className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">パスワード</p>
                      <p className="text-gray-900 font-mono font-bold text-lg">
                        {showPassword ? studentData?.pw : '••••••••'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex gap-3">
                <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-xs text-yellow-800 leading-relaxed">
                  IDとパスワードは他人に教えないように大切に保管してください。
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
              >
                戻る
              </button>
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} School Administration System
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;