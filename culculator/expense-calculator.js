const safe = (text) =>
  text.replace(/[&<>]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;"
  })[char]);

class ExpenseCalculator extends HTMLElement {
  constructor() {
    super();
    this.items = [];

    this.innerHTML = `
      <section class="calculator">
        <h1>Калькулятор расходов</h1>
        <form>
          <div class="fields">
            <label class="field">Название<input name="name" required></label>
            <label class="field">Сумма<input name="amount" type="number" min="0.01" step="0.01" required></label>
          </div>
          <p class="error"></p>
          <button type="submit">Добавить расход</button>
        </form>
        <ul></ul>
        <p class="total">Итого: <output>0.00 ₽</output></p>
      </section>
    `;

    this.form = this.querySelector("form");
    this.list = this.querySelector("ul");
    this.error = this.querySelector(".error");

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.addExpense();
    });

    this.list.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      const index = Number(button.dataset.index);
      this.deleteExpense(index);
    });

    this.render();
  }

  addExpense() {
    const name = this.form.elements.name.value.trim();
    const amount = Number(this.form.elements.amount.value);

    if (!name || !Number.isFinite(amount) || amount <= 0) {
      this.error.textContent = "Введите название и сумму больше нуля.";
      return;
    }

    this.items.push({ name, amount });
    this.form.reset();
    this.error.textContent = "";
    this.render();
  }

  deleteExpense(index) {
    this.items = this.items.filter((_, itemIndex) => itemIndex !== index);
    this.render();
  }

  render() {
    const total = this.items.reduce((sum, item) => sum + item.amount, 0);

    this.list.innerHTML = this.items.length
      ? this.items.map(({ name, amount }, index) => `
          <li>${safe(name)} — ${amount.toFixed(2)} ₽
            <button type="button" data-index="${index}">Удалить</button>
          </li>
        `).join("")
      : "<li>Расходов нет</li>";

    this.querySelector("output").textContent = `${total.toFixed(2)} ₽`;
  }
}

customElements.define("expense-calculator", ExpenseCalculator);
