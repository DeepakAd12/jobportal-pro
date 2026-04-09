export function getCompanyName(jobOrApplicationJob) {
  if (typeof jobOrApplicationJob?.company === "string" && jobOrApplicationJob.company.trim()) {
    return jobOrApplicationJob.company;
  }

  const creator = jobOrApplicationJob?.created_by;

  if (typeof creator === "string" && creator.trim()) {
    return creator;
  }

  if (creator?.username) {
    return creator.username;
  }

  if (creator?.email) {
    return creator.email;
  }

  return "Unknown Company";
}

export function formatSalary(salary, suffix = "") {
  if (salary === null || salary === undefined || salary === "") {
    return "Salary not disclosed";
  }

  const amount = Number(salary);
  if (Number.isNaN(amount)) {
    return "Salary not disclosed";
  }

  return `Rs ${amount.toLocaleString()}${suffix}`;
}
