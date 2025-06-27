import React from 'react';
import { useToast } from '../../hooks/useToast';
import Button from '../common/Button';

export const NotificationDemo: React.FC = () => {
    const toast = useToast();

    return (
        <div className="p-4 border rounded-lg bg-base-100 space-y-4">
            <h2 className="text-lg font-medium mb-4">Notification System Demo</h2>

            <div className="flex flex-wrap gap-2">
                <Button
                    buttonType="primary"
                    onClick={() => toast.success('Operation completed successfully!')}
                >
                    Show Success
                </Button>

                <Button
                    buttonType="error"
                    onClick={() => toast.error('An error occurred. Please try again.')}
                >
                    Show Error
                </Button>

                <Button
                    buttonType="secondary"
                    onClick={() => toast.info('Here is some information', false)}
                >
                    Show Info
                </Button>

                <Button
                    buttonType="warning"
                    onClick={() => toast.warning('This is a warning message', false)}
                >
                    Show Warning
                </Button>

                <Button
                    buttonType="info"
                    onClick={() => toast.info('This will disappear in 3 seconds', true, 3000)}
                >
                    Auto-close (3s)
                </Button>
            </div>
        </div>
    );
};
