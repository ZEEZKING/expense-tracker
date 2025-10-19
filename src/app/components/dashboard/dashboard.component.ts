import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { Expense, ExpenseCategory, CategorySummary, TrendData } from '../../models/expense.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  categorySummary: CategorySummary[] = [];
  trendData: TrendData[] = [];

  expenseForm: FormGroup;
  filterForm: FormGroup;

  showExpenseModal = false;
  editingExpenseId: string | null = null;
  loading = false;
  error = '';

  categories = [
    { value: ExpenseCategory.Food, label: 'Food' },
    { value: ExpenseCategory.Transport, label: 'Transport' },
    { value: ExpenseCategory.Rent, label: 'Rent' },
    { value: ExpenseCategory.Entertainment, label: 'Entertainment' },
    { value: ExpenseCategory.Utilities, label: 'Utilities' },
    { value: ExpenseCategory.Others, label: 'Others' }
  ];


  private trendChart: Chart | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {
    this.expenseForm = this.fb.group({
      title: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: [ExpenseCategory.Others, Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      notes: ['']
    });

    this.filterForm = this.fb.group({
      category: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadExpenses();
    this.loadCategorySummary();
    this.loadTrend();
  }

  loadExpenses(): void {
    this.loading = true;
    this.expenseService.getAllExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load expenses';
        this.loading = false;
      }
    });
  }

  loadCategorySummary(): void {
    this.expenseService.getCategorySummary().subscribe({
      next: (data) => {
        this.categorySummary = data;
      },
      error: (err) => {
        console.error('Failed to load category summary', err);
      }
    });
  }

  loadTrend(): void {
    this.expenseService.getTrend().subscribe({
      next: (data) => {
        this.trendData = data;
        this.renderTrendChart();
      },
      error: (err) => {
        console.error('Failed to load trend data', err);
      }
    });
  }

formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${months[month - 1]} ${year}`;
}

 renderTrendChart(): void {
  const canvas = document.getElementById('trendChart') as HTMLCanvasElement;
  if (!canvas) return;

  if (this.trendChart) {
    this.trendChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  this.trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.trendData.map(d => this.formatMonthLabel(d.month)),
      datasets: [{
        label: 'Spending Trend',
        data: this.trendData.map(d => d.totalSpent),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return '₦' + value;
            }
          }
        }
      }
    }
  });
}



  openExpenseModal(expense?: Expense): void {
    console.log('Opening expense modal...', expense);
    if (expense) {
      this.editingExpenseId = expense.id;
      this.expenseForm.patchValue({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
        notes: expense.notes
      });
    } else {
      this.editingExpenseId = null;
      this.expenseForm.reset({
        title: '',
        amount: 0,
        category: ExpenseCategory.Others,
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }

    this.showExpenseModal = true;
    console.log('Modal should be visible now', this.showExpenseModal);
  }


  closeExpenseModal(): void {
    this.showExpenseModal = false;
    this.editingExpenseId = null;
    this.expenseForm.reset();
  }

  saveExpense(): void {
    if (this.expenseForm.invalid) return;

    const formValue = this.expenseForm.value;
    const expenseData = {
      ...formValue,
      category: Number(formValue.category),
      date: new Date(formValue.date).toISOString()
    };

    if (this.editingExpenseId) {
      const updateData = {
        id: this.editingExpenseId,
        ...expenseData
      };

      this.expenseService.updateExpense(updateData).subscribe({
        next: () => {
          this.loadExpenses();
          this.loadCategorySummary();
          this.loadTrend();
          this.closeExpenseModal();
        },
        error: (err) => {
          this.error = 'Failed to update expense';
        }
      });
    } else {
      this.expenseService.createExpense(expenseData).subscribe({
        next: () => {
          this.loadExpenses();
          this.loadCategorySummary();
          this.loadTrend();
          this.closeExpenseModal();
        },
        error: (err) => {
          this.error = 'Failed to create expense';
        }
      });
    }
  }

  deleteExpense(id: string): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.loadExpenses();
          this.loadCategorySummary();
          this.loadTrend();
        },
        error: (err) => {
          this.error = 'Failed to delete expense';
        }
      });
    }
  }

  applyFilter(): void {
    const filter = this.filterForm.value;

    if (!filter.category && !filter.startDate && !filter.endDate) {
      this.loadExpenses();
      return;
    }

    const filterData: any = {};
    if (filter.category) filterData.category = filter.category;
    if (filter.startDate) filterData.startDate = new Date(filter.startDate).toISOString();
    if (filter.endDate) filterData.endDate = new Date(filter.endDate).toISOString();

    this.expenseService.filterExpenses(filterData).subscribe({
      next: (data) => {
        this.expenses = data;
      },
      error: (err) => {
        this.error = 'Failed to filter expenses';
      }
    });
  }

  clearFilter(): void {
    this.filterForm.reset({
      category: '',
      startDate: '',
      endDate: ''
    });
    this.loadExpenses();
  }

  getCategoryLabel(categoryValue: number): string {
    const category = this.categories.find(c => c.value === categoryValue);
    return category ? category.label : 'Unknown';
  }

  getTotalSpending(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }
}
