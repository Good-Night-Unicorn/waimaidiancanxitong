<template>
  <footer class="footer">
    <div class="page-container footer__inner">
      <div class="footer__links">
        <div>
          <h4>用户帮助</h4>
          <a href="#">服务中心</a>
          <a href="#">常见问题</a>
          <a href="#">用户反馈</a>
        </div>
        <div>
          <h4>商家合作</h4>
          <a href="#">我要开店</a>
          <a href="#">品牌加盟</a>
          <a href="#">营销合作</a>
        </div>
        <div>
          <h4>关于我们</h4>
          <a href="#">公司介绍</a>
          <a href="#">加入我们</a>
          <a href="#">联系我们</a>
        </div>
        <div>
          <h4>商务合作</h4>
          <a href="#">市场合作</a>
          <a href="#">品牌推广</a>
          <a href="#">媒体合作</a>
        </div>
      </div>
      <p class="footer__copy">© 2025 美食外卖 | 享受美味 快速送达</p>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.footer {
  background: #f5f6fa;
  padding: 40px 0;
  color: #666;
  margin-top: 48px;

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__links {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;

    h4 {
      margin: 0 0 12px;
      color: #333;
      font-size: 16px;
    }

    a {
      display: block;
      font-size: 14px;
      margin-bottom: 8px;
      color: #666;

      &:hover {
        color: #ff6d39;
      }
    }
  }

  &__copy {
    text-align: center;
    font-size: 14px;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 32px 0;

    &__links {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 480px) {
  .footer__links {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>

