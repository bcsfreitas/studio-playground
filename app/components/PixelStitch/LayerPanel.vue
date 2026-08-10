<script setup lang="ts">
import { usePixelStitchContext } from '~/composables/usePixelStitchContext'

const editor = usePixelStitchContext()
const { t } = useI18n()

const layers = computed(() => editor.currentFrame.value?.layers ?? [])
</script>

<template>
  <UPageCard variant="outline" :ui="{ root: 'rounded-2xl', container: 'p-4 sm:p-4 gap-3' }">
    <div class="flex items-center justify-between">
      <h3 class="font-heading font-bold text-sm text-highlighted">{{ t('pixelStitch.layers.title') }}</h3>
      <UTooltip :text="t('pixelStitch.layers.addTooltip')">
        <UButton
          :label="t('pixelStitch.layers.add')"
          icon="lucide:plus"
          size="xs"
          color="neutral"
          variant="outline"
          @click="editor.addLayer()"
        />
      </UTooltip>
    </div>

    <!-- Listed bottom-up, matching the compositing order: the first entry is
         the layer everything else paints over. -->
    <div class="flex max-h-96 flex-col gap-2 overflow-y-auto">
      <UCard
        v-for="(layer, index) in layers"
        :key="layer.id"
        variant="subtle"
        :ui="{
          root: editor.currentLayerIndex.value === index ? 'rounded-xl ring-2 ring-primary' : 'rounded-xl',
          body: 'p-2.5 sm:p-2.5 flex flex-col gap-2'
        }"
        class="cursor-pointer"
        @click="editor.currentLayerIndex.value = index"
      >
        <div class="flex items-center gap-1">
          <UTooltip :text="layer.visible ? t('pixelStitch.layers.hide') : t('pixelStitch.layers.show')">
            <UButton
              :icon="layer.visible ? 'lucide:eye' : 'lucide:eye-off'"
              size="xs"
              color="neutral"
              variant="ghost"
              :aria-label="layer.visible ? t('pixelStitch.layers.hide') : t('pixelStitch.layers.show')"
              @click.stop="editor.toggleLayerVisibility(index)"
            />
          </UTooltip>

          <UTooltip :text="t('pixelStitch.layers.rename')" class="flex-1 min-w-0">
            <UInput
              :model-value="layer.name"
              size="xs"
              :aria-label="t('pixelStitch.layers.rename')"
              class="w-full"
              @click.stop
              @update:model-value="value => editor.renameLayer(index, String(value))"
            />
          </UTooltip>

          <UTooltip :text="t('pixelStitch.layers.moveUp')">
            <UButton
              icon="lucide:chevron-up"
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="index === layers.length - 1"
              :aria-label="t('pixelStitch.layers.moveUp')"
              @click.stop="editor.moveLayer(index, 1)"
            />
          </UTooltip>
          <UTooltip :text="t('pixelStitch.layers.moveDown')">
            <UButton
              icon="lucide:chevron-down"
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="index === 0"
              :aria-label="t('pixelStitch.layers.moveDown')"
              @click.stop="editor.moveLayer(index, -1)"
            />
          </UTooltip>
          <UTooltip :text="t('pixelStitch.layers.delete')">
            <UButton
              icon="lucide:trash-2"
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="layers.length === 1"
              :aria-label="t('pixelStitch.layers.delete')"
              @click.stop="editor.deleteLayer(index)"
            />
          </UTooltip>
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between text-xs text-dimmed">
            <span>{{ t('pixelStitch.layers.opacity') }}</span>
            <span class="tabular-nums">{{ Math.round(layer.opacity * 100) }}%</span>
          </div>
          <USlider
            :model-value="layer.opacity"
            :min="0"
            :max="1"
            :step="0.1"
            size="xs"
            @click.stop
            @update:model-value="value => editor.setLayerOpacity(index, Number(value))"
          />
        </div>
      </UCard>
    </div>
  </UPageCard>
</template>
