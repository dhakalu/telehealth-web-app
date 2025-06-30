import { useState } from "react";
import { LoadingSpinner } from "~/components/common";
import Button from "~/components/common/Button";

export default function LoadingSpinnerDemo() {
    const [demoStates, setDemoStates] = useState({
        fullScreen: false,
        section: false,
        button: false,
    });

    const toggleDemo = (key: keyof typeof demoStates) => {
        setDemoStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-3xl font-bold">LoadingSpinner Component Demo</h1>

            {/* Size Examples */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Different Sizes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <h3 className="text-sm font-medium mb-2">Small</h3>
                        <LoadingSpinner size="sm" message="" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-sm font-medium mb-2">Medium</h3>
                        <LoadingSpinner size="md" message="" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-sm font-medium mb-2">Large</h3>
                        <LoadingSpinner size="lg" message="" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-sm font-medium mb-2">Extra Large</h3>
                        <LoadingSpinner size="xl" message="" />
                    </div>
                </div>
            </div>

            {/* Message Examples */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">With Messages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-200 p-6">
                        <LoadingSpinner
                            size="md"
                            message="Loading user data..."
                        />
                    </div>
                    <div className="card bg-base-200 p-6">
                        <LoadingSpinner
                            size="md"
                            message="Processing request..."
                        >
                            <p className="text-sm text-base-content/70">
                                This may take a few moments
                            </p>
                        </LoadingSpinner>
                    </div>
                </div>
            </div>

            {/* Interactive Examples */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Interactive Examples</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Full Screen Demo */}
                    <div className="card bg-base-200 p-6">
                        <h3 className="font-medium mb-4">Full Screen Loading</h3>
                        <Button
                            buttonType="primary"
                            onClick={() => {
                                toggleDemo('fullScreen');
                                setTimeout(() => toggleDemo('fullScreen'), 3000);
                            }}
                        >
                            Show Full Screen (3s)
                        </Button>
                    </div>

                    {/* Section Loading Demo */}
                    <div className="card bg-base-200 p-6">
                        <h3 className="font-medium mb-4">Section Loading</h3>
                        <Button
                            buttonType="secondary"
                            onClick={() => {
                                toggleDemo('section');
                                setTimeout(() => toggleDemo('section'), 2000);
                            }}
                        >
                            Show Section Loading (2s)
                        </Button>
                        {demoStates.section && (
                            <div className="mt-4 p-4 bg-base-100 rounded">
                                <LoadingSpinner
                                    size="md"
                                    message="Loading section data..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Button Loading Demo */}
                    <div className="card bg-base-200 p-6">
                        <h3 className="font-medium mb-4">Button Loading</h3>
                        <Button
                            buttonType="accent"
                            disabled={demoStates.button}
                            onClick={() => {
                                toggleDemo('button');
                                setTimeout(() => toggleDemo('button'), 2000);
                            }}
                        >
                            {demoStates.button ? (
                                <div className="flex items-center gap-2">
                                    <LoadingSpinner size="sm" message="" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Submit Form"
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Usage Code Examples */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Usage Examples</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card bg-base-200 p-6">
                        <h3 className="font-medium mb-2">Basic Usage</h3>
                        <pre className="text-xs bg-base-300 p-3 rounded overflow-x-auto">
                            {`<LoadingSpinner />

<LoadingSpinner 
  message="Loading..." 
  size="md" 
/>

<LoadingSpinner 
  fullScreen 
  message="Loading app..." 
/>`}
                        </pre>
                    </div>

                    <div className="card bg-base-200 p-6">
                        <h3 className="font-medium mb-2">With Custom Content</h3>
                        <pre className="text-xs bg-base-300 p-3 rounded overflow-x-auto">
                            {`<LoadingSpinner 
  message="Processing..."
  size="lg"
>
  <p className="text-sm">
    Please wait...
  </p>
</LoadingSpinner>`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Full Screen Loading Overlay */}
            {demoStates.fullScreen && (
                <LoadingSpinner
                    fullScreen
                    message="Loading application..."
                    size="lg"
                />
            )}
        </div>
    );
}
