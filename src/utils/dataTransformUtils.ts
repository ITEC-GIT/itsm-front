export const transformStaticData = (data: any) => {
    const statusOptions = data.statusOptions.map((option: any) => ({
      value: option.id,
      label: option.label,
    }));
  
    const urgencyOptions = data.urgencyOptions.map((option: any) => ({
      value: option.id,
      label: option.label,
    }));
  
    const priorityOptions = data.priorityOptions.map((option: any) => ({
      value: option.id,
      label: option.label,
    }));
  
    const typeOptions = data.typeOptions.map((option: any) => ({
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