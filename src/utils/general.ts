import {useToast} from '@/components/ui/toast/use-toast';

const {toast} = useToast();

export function showToast(title: string, description: string) {
  toast({
    title: title,
    description: description,
  });
}
