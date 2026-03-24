<template>
  <div class="flex flex-col items-center justify-center w-1/3 my-0 mx-auto">
    <h2 class="text-xl mb-3">Вход</h2>
    <Message v-if="needAuth" severity="warn" variant="outlined" class="p-2 mb-2" closable>
      Для доступа к данной странице({{ destinationTitle }}) необходимо авторизоваться
    </Message>
    <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" :validateOnBlur="true"
      :validateOnValueUpdate="false" @submit="loginSubmit" :feedback="false"
      class="flex flex-col gap-2 w-full px-3 py-2 ">
      <Fieldset legend="Введите логин и пароль">
        <div class="flex flex-col items-left gap-4 mb-2" data-test-id="email__inputbox">
          <label for="email" class="font-semibold ">e-mail</label>
          <InputText id="email" name="email" class="flex-auto w-full" />
          <Message id="email__error-msg" data-test-id="email__error-msg" v-if="$form.email?.invalid" severity="error"
            size="small" variant="simple">
            {{ $form.email.error.message }}
          </Message>
        </div>
        <div class="flex flex-col items-left gap-4 mb-2">
          <label for="password" class="font-semibold ">пароль</label>
          <Password id="password" name="password" class="flex-auto w-full" />
          <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error.message }}</Message>
        </div>
      </Fieldset>
      <div class="flex justify-end gap-2 w-full">
        <Button type="button" label="Вернуться" severity="secondary" @click="loginCancel"></Button>
        <Button type="submit" label="Войти" />
      </div>
    </Form>
    <Message v-show="user.loginError !== ''">{{ user.loginError }}</Message>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Form } from '@primevue/forms';
import Fieldset from 'primevue/fieldset';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Message from 'primevue/message';
import Button from 'primevue/button';
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const user = useUserStore();

// Проверяем, есть ли параметр needAuth в URL и объясняем пользователю, что ему нужно авторизоваться
const route = useRoute();
const needAuth = route?.query.needAuth || false
const destinationTitle = route?.query.destinationTitle

// TODO: убрать тестовые данные
const initialValues = ref({
  // email: 'shumakovmv@gmail.com',
  // password: '7cJi?#9tvV*)*.'
});

const resolver = zodResolver(
  z.object({
    email: z.email({ message: 'e-mail не соответствует формату' }),
    password: z.string().nonempty({ message: 'Пароль не может быть пустым' }),
  })
)

const loginSubmit = (e) => {
  if (e.valid) {
    if (user.login(e.values.email, e.values.password)) {
      router.push({ name: 'home' })
      // TODO: Реализовать переход на страницу, на которую хотел перейти пользователь(страница с обязательной авторизацией)
    } else {
      console.log("🚀 ~ loginSubmit ~ user.loginError:", user.loginError)
      router.push({ name: 'login' })
    }
  }
}
const loginCancel = () => {
  router.push({ name: 'home' })
}

</script>
