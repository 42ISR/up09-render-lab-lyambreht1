const container = document.getElementById('items-container')

async function fetchItems() {
  try {
    const response = await fetch('https://kitek.ktkv.dev/marketplace/api/items')

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const items = await response.json()

    renderStats(items)
    renderItems(items)
  } catch (error) {
    console.error('Ошибка загрузки:', error)

    container.innerHTML = `
      <div class="no-items">
        <div class="no-items-icon">⚠️</div>
        <h2>Не удалось загрузить товары</h2>
        <p>Попробуйте обновить страницу позже</p>
      </div>
    `
  }
}

function renderStats(items) {
  const total = items.length
  const totalBids = items.reduce((sum, item) => sum + (item.bidsCount || 0), 0)
  const activeCount = items.filter((item) => item.status === 'active').length
  const avgPrice =
    total > 0
      ? Math.round(items.reduce((sum, item) => sum + (item.price || 0), 0) / total)
      : 0

  const statValues = document.querySelectorAll('.stat-value')
  statValues[0].textContent = total
  statValues[1].textContent = totalBids
  statValues[2].textContent = activeCount
  statValues[3].textContent = `${avgPrice.toLocaleString('ru-RU')} ₽`
}

function renderItems(items) {
  if (!items.length) {
    container.innerHTML = `
      <div class="no-items">
        <h2>Товаров пока нет</h2>
      </div>
    `
    return
  }

  const html = items
    .map((item) => {
      const image = item.image || ''
      const title = item.title || 'Без названия'
      const description = item.description || 'Описание отсутствует'
      const price = (item.price || 0).toLocaleString('ru-RU')
      const currentBid = (item.currentBid || 0).toLocaleString('ru-RU')
      const bidsCount = item.bidsCount || 0
      const seller = item.seller?.username || 'unknown'

      const isActive = item.status === 'active'
      const statusClass = isActive ? 'status-active' : 'status-closed'
      const statusText = isActive ? 'Активно' : 'Закрыто'

      return `
        <div class="item-card">
          ${
            image
              ? `<img src="${image}" alt="${title}" class="item-image" />`
              : ''
          }
          <div class="item-content">
            <span class="status-badge ${statusClass}">
              ${statusText}
            </span>

            <h3 class="item-title">${title}</h3>

            <p class="item-description">${description}</p>

            <div class="item-footer">
              <div>
                <div class="item-price">${price} ₽</div>

                <div class="bid-info">
                  Текущая ставка: ${currentBid} ₽
                  <span class="bid-count">${bidsCount}</span>
                </div>
              </div>

              <div class="item-meta">
                <span class="item-seller">Продавец: ${seller}</span>
              </div>
            </div>
          </div>
        </div>
      `
    })
    .join('')

  container.innerHTML = html
}

fetchItems()