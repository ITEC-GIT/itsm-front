export const transformStaticData = (data: any) => {
    const statusOptions = data.status.map((option: any) => ({
      value: option.id,
      label: option.label,
    }));
  
    const urgencyOptions = data.urgency.map((option: any) => ({
      value: option.id,
      label: option.label,
    }));
  
    const priorityOptions = data.priority.map((option: any) => ({
      value: option.id,
      label: option.label,
    }));
  
    const typeOptions = data.type.map((option: any) => ({
      value: option.id,
      label: option.label,
    }));

  
    return {
      statusOptions,
      urgencyOptions,
      priorityOptions,
      typeOptions
    };
  };