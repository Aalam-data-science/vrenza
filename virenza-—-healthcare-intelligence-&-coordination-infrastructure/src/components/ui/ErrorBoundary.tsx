import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('VIRENZA Error Boundary caught an unhandled render error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('virenza_platform_db_v2');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F5F0] text-[#22241F] flex items-center justify-center p-4">
          <Card padding="lg" variant="surface" className="max-w-lg w-full text-center space-y-5 border-[#E7E4DC] shadow-md">
            <div className="w-12 h-12 rounded-full bg-[#FBE9E7] border border-[#B03A28]/30 flex items-center justify-center mx-auto text-[#B03A28]">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-[#22241F]">
                Display State Recovered
              </h2>
              <p className="text-xs text-[#5A564C] leading-relaxed">
                The application encountered an unexpected state during page rendering. Your sovereign cryptographic keys and local store remain secure.
              </p>
              {this.state.error && (
                <div className="bg-[#F4F2EE] border border-[#E7E4DC] rounded-lg p-2.5 text-[11px] font-mono text-[#7A7568] text-left overflow-x-auto max-h-32">
                  {this.state.error.message || String(this.state.error)}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleReload}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reload Page
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={this.handleReset}
                leftIcon={<Home className="w-3.5 h-3.5" />}
              >
                Reset Demo State
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
